import { MaybePromise } from "@/types/utils.types";

const FRAME_BUDGET = 16; // ~60fps
const MIN_CHUNK_SIZE = 1;
const MAX_CHUNK_SIZE = 20;
const INITIAL_CHUNK_SIZE = 5;
const TOLERANCE = 0.2;
const RESET_TIMEOUT = 1000;
const CHUNK_SIZE_ADJUSTMENT = 1;

export type Callback = () => MaybePromise<void>;

export type CallbackWithId = {
  callback: Callback;
  id: string;
};

type QueueItem = {
  callback: Callback;
  id: string;
};

export class CallbackQueue {
  private static instance: CallbackQueue | null = null;
  private queue = new UniqueQueue();
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

  public enqueueArray(callbacks: CallbackWithId[]): void {
    callbacks.forEach(({ callback, id }) => {
      this.queue.enqueue({ callback, id });
    });
    this.processQueue();
    this.cancelResetTimer();
  }

  public enqueue(callback: Callback, id: string): void {
    this.queue.enqueue({ callback, id });
    this.processQueue();
    this.cancelResetTimer();
  }

  private async processQueue(): Promise<void> {
    while (!this.queue.isEmpty) {
      await new Promise((resolve) => requestAnimationFrame(resolve));

      this.frameStartTime = performance.now();
      const chunk = this.queue.dequeueChunk(this.chunkSize);

      for (const item of chunk) {
        if (performance.now() - this.frameStartTime > FRAME_BUDGET) {
          // If we're exceeding frame budget, push remaining callbacks back to queue
          this.queue.pushFront(chunk.slice(chunk.indexOf(item)));
          break;
        }

        try {
          await item.callback();
        } catch (error) {
          console.error("Error processing callback:", error);
        }
      }

      const processingTime = performance.now() - this.frameStartTime;
      this.adjustChunkSize(processingTime);
    }

    this.startResetTimer();
  }

  private adjustChunkSize(processingTime: number): void {
    if (processingTime > FRAME_BUDGET * (1 + TOLERANCE)) {
      this.chunkSize = Math.max(
        MIN_CHUNK_SIZE,
        Math.floor(this.chunkSize * (FRAME_BUDGET / processingTime)),
      );
    } else if (
      processingTime < FRAME_BUDGET * (1 - TOLERANCE) &&
      this.queue.length > 0
    ) {
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
    this.queue.clear();
    this.cancelResetTimer();
  }
}

class UniqueQueue {
  private queue: QueueItem[] = [];
  private set = new Set<string>();

  enqueue(item: QueueItem): boolean {
    if (!this.set.has(item.id)) {
      this.queue.push(item);
      this.set.add(item.id);
      return true;
    }
    return false;
  }

  dequeue(): QueueItem | undefined {
    const item = this.queue.shift();
    if (item) {
      this.set.delete(item.id);
    }
    return item;
  }

  dequeueChunk(size: number): QueueItem[] {
    const chunk: QueueItem[] = [];
    for (let i = 0; i < size && this.queue.length > 0; i++) {
      const item = this.dequeue();
      if (item) chunk.push(item);
    }
    return chunk;
  }

  pushFront(items: QueueItem[]): void {
    // Remove existing IDs to prevent duplicates
    items.forEach((item) => this.set.delete(item.id));
    // Add new items to front of queue
    this.queue.unshift(...items);
    // Re-add IDs to set
    items.forEach((item) => this.set.add(item.id));
  }

  clear(): void {
    this.queue = [];
    this.set.clear();
  }

  get isEmpty(): boolean {
    return this.queue.length === 0;
  }

  get length(): number {
    return this.queue.length;
  }
}
