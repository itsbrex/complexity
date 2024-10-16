import { decodePacket } from "engine.io-parser";
import { nanoid } from "nanoid";
import io, { Socket } from "socket.io-client";

export default class InternalWebSocketManager {
  private static instance: InternalWebSocketManager;

  private sockets: Map<string, Socket["io"]["engine"]>;

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
  ): Promise<Socket["io"]["engine"]> {
    return new Promise((resolve, reject) => {
      const socket = io(
        `www.perplexity.ai/${namespace ? `?src=${namespace}` : ""}`,
        {
          transports: ["polling", "websocket"],
          upgrade: true,
          reconnection: false,
        },
      ).io.engine;

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

  public getSocket(id?: string): Socket["io"]["engine"] | null {
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

  public async sendMessage(params: { id?: string; data: string }) {
    let socket = this.getSocket(params.id);

    if (socket == null) {
      socket = await this.handShake(params.id);
    }

    if (socket.readyState === "opening") {
      await new Promise<void>((resolve) => socket.once("open", resolve));
    }

    socket?.send(params.data);
  }

  private removeClosedSockets() {
    Array.from(this.sockets.entries()).forEach(([id, socket]) => {
      if (socket.readyState === "closed") {
        this.sockets.delete(id);
      }
    });
  }
}
