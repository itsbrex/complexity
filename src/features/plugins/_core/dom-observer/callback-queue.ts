import { MaybePromise } from "@/types/utils.types";

const FRAME_BUDGET = 16; // ~60fps
const MIN_CHUNK_SIZE = 1;
const MAX_CHUNK_SIZE = 20;
const INITIAL_CHUNK_SIZE = 5;
const TOLERANCE = 0.2;
const RESET_TIMEOUT = 1000;
const CHUNK_SIZE_ADJUSTMENT = 1;

export type Callback = () => MaybePromise<void>;

class Node {
  constructor(
    public callback: Callback,
    public next: Node | null = null,
  ) {}
}

export class CallbackQueue {
  private static instance: CallbackQueue | null = null;
  private head: Node | null = null;
  private tail: Node | null = null;
  private isProcessing = false;
  private chunkSize = INITIAL_CHUNK_SIZE;
  private resetTimer: number | null = null;
  private frameStartTime = 0;

  private constructor() {}

  static getInstance(): CallbackQueue {
    if (!CallbackQueue.instance) {
      CallbackQueue.instance = new CallbackQueue();
    }
    return CallbackQueue.instance;
  }

  public enqueueArray(callbacks: Callback[]): void {
    for (const callback of callbacks) {
      this.enqueue(callback);
    }
  }

  public enqueue(callback: Callback): void {
    const newNode = new Node(callback);
    if (!this.head || !this.tail) {
      this.head = this.tail = newNode;
    } else if (this.tail != null) {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.startProcessing();
    this.cancelResetTimer();
  }

  private startProcessing(): void {
    if (!this.isProcessing) {
      this.isProcessing = true;
      this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    while (this.head) {
      await new Promise((resolve) => requestAnimationFrame(resolve));

      this.frameStartTime = performance.now();
      const chunk = this.dequeueChunk();

      for (const callback of chunk) {
        if (performance.now() - this.frameStartTime > FRAME_BUDGET) {
          // If we're exceeding frame budget, push remaining callbacks back to queue
          this.pushBackToQueue(chunk.slice(chunk.indexOf(callback)));
          break;
        }

        try {
          await callback();
        } catch (error) {
          console.error("Error processing callback:", error);
        }
      }

      const processingTime = performance.now() - this.frameStartTime;
      this.adjustChunkSize(processingTime);
    }

    this.isProcessing = false;
    this.startResetTimer();
  }

  private pushBackToQueue(callbacks: Callback[]): void {
    if (callbacks.length === 0) return;

    const newHead = new Node(callbacks[0]);
    let current = newHead;

    for (let i = 1; i < callbacks.length; i++) {
      current.next = new Node(callbacks[i]);
      current = current.next;
    }

    current.next = this.head;
    this.head = newHead;
  }

  private dequeueChunk(): Callback[] {
    const chunk: Callback[] = [];
    for (let i = 0; i < this.chunkSize && this.head; i++) {
      chunk.push(this.head.callback);
      this.head = this.head.next;
    }
    if (!this.head) {
      this.tail = null;
    }
    return chunk;
  }

  private adjustChunkSize(processingTime: number): void {
    if (processingTime > FRAME_BUDGET * (1 + TOLERANCE)) {
      this.chunkSize = Math.max(
        MIN_CHUNK_SIZE,
        Math.floor(this.chunkSize * (FRAME_BUDGET / processingTime)),
      );
    } else if (processingTime < FRAME_BUDGET * (1 - TOLERANCE) && this.head) {
      this.chunkSize = Math.min(
        MAX_CHUNK_SIZE,
        this.chunkSize + CHUNK_SIZE_ADJUSTMENT,
      );
    }
  }

  private startResetTimer(): void {
    this.cancelResetTimer();
    this.resetTimer = window.setTimeout(() => {
      if (this.chunkSize < MAX_CHUNK_SIZE) {
        // console.log(
        //   `Resetting chunk size to ${MAX_CHUNK_SIZE} due to inactivity`,
        // );
        this.chunkSize = MAX_CHUNK_SIZE;
      }
    }, RESET_TIMEOUT);
  }

  private cancelResetTimer(): void {
    if (this.resetTimer !== null) {
      clearTimeout(this.resetTimer);
      this.resetTimer = null;
    }
  }

  public clear(): void {
    this.head = null;
    this.tail = null;
    this.isProcessing = false;
    this.cancelResetTimer();
  }
}
