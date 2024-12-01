import { decodePacket } from "engine.io-parser";
import { nanoid } from "nanoid";
import io, { Socket } from "socket.io-client";

export default class InternalWebSocketManager {
  private static instance: InternalWebSocketManager;

  private sockets: Map<string, Socket>;

  private constructor() {
    this.sockets = new Map();
  }

  static getInstance(): InternalWebSocketManager {
    if (InternalWebSocketManager.instance == null) {
      InternalWebSocketManager.instance = new InternalWebSocketManager();
    }
    return InternalWebSocketManager.instance;
  }

  public async handShake(
    namespace?: string,
    id: string = nanoid(),
  ): Promise<Socket> {
    return new Promise((resolve, reject) => {
      const socket = io(
        `www.perplexity.ai/${namespace ? `?src=${namespace}` : ""}`,
        {
          transports: ["polling", "websocket"],
          upgrade: true,
          reconnection: false,
        },
      );

      this.sockets.set(id, socket);

      socket.on("message", async (message) => {
        const decodedData = decodePacket(message);
        const sid = decodedData.data.match(/^\{"sid":"(.+)"\}$/)?.[1];

        if (decodedData.type === "open" && sid != null) {
          return resolve(socket);
        }
      });

      socket.on("error", (error) => {
        return reject(error);
      });
    });
  }

  public getSocket(id?: string): Socket | null {
    this.removeClosedSockets();

    if (id == null) {
      if (this.sockets.size === 0) return null;

      return this.sockets.values().next().value ?? null;
    }

    return this.sockets.get(id) ?? null;
  }

  public removeSocket(id: string): boolean {
    this.sockets.get(id)?.close();

    return this.sockets.delete(id);
  }

  private async ensureConnectedSocket(id?: string): Promise<Socket> {
    let socket = this.getSocket(id);

    if (socket == null) {
      socket = await this.handShake(id);
    }

    if (socket.io.engine.readyState === "opening") {
      await new Promise<void>((resolve) => socket.once("open", resolve));
    }

    return socket;
  }

  public async sendMessageWithAck<T = unknown>(params: {
    id?: string;
    data: [string, Record<string, unknown>];
  }): Promise<T> {
    const socket = await this.ensureConnectedSocket(params.id);
    return socket.emitWithAck(...params.data);
  }

  public async sendMessage(params: {
    id?: string;
    data: [string, Record<string, unknown>];
  }): Promise<void> {
    const socket = await this.ensureConnectedSocket(params.id);
    socket.emit(...params.data);
  }

  public async sendRawMessage(params: {
    id?: string;
    data: string;
  }): Promise<void> {
    const socket = await this.ensureConnectedSocket(params.id);
    socket.io.engine.send(params.data);
  }

  private removeClosedSockets() {
    Array.from(this.sockets.entries()).forEach(([id, socket]) => {
      if (socket.io.engine.readyState === "closed") {
        this.sockets.delete(id);
      }
    });
  }
}
