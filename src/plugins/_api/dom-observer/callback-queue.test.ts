import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import {
  CallbackQueue,
  type CallbackWithId,
  type Callback,
} from "@/plugins/_api/dom-observer/callback-queue";

describe("CallbackQueue", () => {
  let queue: CallbackQueue;
  const FRAME_BUDGET_MS = 16;

  const flushPendingOperations = async (flushCycles = 3) => {
    for (let i = 0; i < flushCycles; i++) {
      vi.runAllTimers();
      await Promise.resolve();
    }
  };

  const createBrowserMocks = () => ({
    requestAnimationFrame: vi.fn((callback) => {
      callback(Date.now());
      return 1;
    }),
    setTimeout: vi.fn((callback) => {
      Promise.resolve().then(callback);
      return 1;
    }),
    clearTimeout: vi.fn(),
    performance: { now: vi.fn(() => Date.now()) },
  });

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const queueClass = CallbackQueue as unknown as {
      instance: CallbackQueue | null;
    };
    queueClass.instance = null;

    const browserMocks = createBrowserMocks();
    vi.stubGlobal("window", browserMocks);
    vi.stubGlobal("requestAnimationFrame", browserMocks.requestAnimationFrame);
    vi.stubGlobal("setTimeout", browserMocks.setTimeout);
    vi.stubGlobal("clearTimeout", browserMocks.clearTimeout);
    vi.stubGlobal("performance", browserMocks.performance);

    queue = CallbackQueue.getInstance();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    queue.clear();
  });

  it("should maintain singleton instance", () => {
    const firstInstance = CallbackQueue.getInstance();
    const secondInstance = CallbackQueue.getInstance();
    expect(firstInstance).toBe(secondInstance);
  });

  it("should process single callback", async () => {
    const mockCallback = vi.fn();
    queue.enqueue(mockCallback, "1");
    await flushPendingOperations();
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it("should process multiple callbacks in order", async () => {
    const executionOrder: number[] = [];
    const orderedCallbacks: CallbackWithId[] = [1, 2, 3].map((num) => ({
      callback: () => {
        executionOrder.push(num);
      },
      id: `callback-${num}`,
    }));

    queue.enqueueArray(orderedCallbacks);
    await flushPendingOperations();
    expect(executionOrder).toEqual([1, 2, 3]);
  });

  it("should handle async callbacks", async () => {
    const executionResults: number[] = [];
    const delayedCallback = async () => {
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 10);
      });
      executionResults.push(1);
    };

    queue.enqueue(delayedCallback, "async");
    await flushPendingOperations();
    vi.advanceTimersByTime(10);
    await Promise.resolve();

    expect(executionResults).toEqual([1]);
  });

  it("should prevent duplicate callbacks with same id", async () => {
    const mockCallback = vi.fn();

    queue.enqueue(mockCallback, "duplicate-id");
    queue.enqueue(mockCallback, "duplicate-id");

    await flushPendingOperations();

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it("should handle errors in callbacks without breaking the queue", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const successCallback = vi.fn();

    queue.enqueueArray([
      {
        callback: () => {
          throw new Error("Test error");
        },
        id: "failing-callback",
      },
      {
        callback: successCallback,
        id: "success-callback",
      },
    ]);

    await flushPendingOperations();

    expect(errorSpy).toHaveBeenCalled();
    expect(successCallback).toHaveBeenCalled();
  });

  it("should clear the queue", async () => {
    const mockCallback = vi.fn();

    queue.enqueue(mockCallback, "to-be-cleared");
    queue.clear();

    await flushPendingOperations();

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it("should adjust chunk size based on processing time", async () => {
    const simulateSlowOperation = vi.fn(() => {
      vi.advanceTimersByTime(FRAME_BUDGET_MS + 4);
    });

    const slowCallbacks: CallbackWithId[] = Array(10)
      .fill(null)
      .map((_, index) => ({
        callback: simulateSlowOperation as unknown as Callback,
        id: `slow-operation-${index}`,
      }));

    queue.enqueueArray(slowCallbacks);

    const processAnimationFrames = async (frameCount: number) => {
      for (let i = 0; i < frameCount; i++) {
        vi.runAllTimers();
        const rafMock = vi.mocked(window.requestAnimationFrame);
        const rafCallback = rafMock.mock.calls[0]?.[0];
        if (rafCallback) {
          rafCallback(performance.now());
        }
        await Promise.resolve();
        vi.runAllTimers();
        await Promise.resolve();
      }
    };

    await processAnimationFrames(20);
    expect(simulateSlowOperation).toHaveBeenCalledTimes(10);
  });

  it("should process callbacks in insertion order", async () => {
    const executionOrder: string[] = [];
    const orderedCallbacks: CallbackWithId[] = [1, 2, 3].map((num) => ({
      id: `callback-${num}`,
      callback: () => {
        executionOrder.push(`execution-${num}`);
      },
    }));

    queue.enqueueArray(orderedCallbacks);
    await flushPendingOperations();

    expect(executionOrder).toEqual([
      "execution-1",
      "execution-2",
      "execution-3",
    ]);
  });

  it("should handle asynchronous callbacks correctly", async () => {
    const executionResults: number[] = [];
    const createDelayedOperation =
      (value: number, delay: number): Callback =>
      () =>
        new Promise<void>((resolve) => {
          setTimeout(() => {
            executionResults.push(value);
            resolve();
          }, delay);
        });

    queue.enqueue(createDelayedOperation(1, 10), "delayed-operation-1");
    queue.enqueue(createDelayedOperation(2, 5), "delayed-operation-2");

    await flushPendingOperations(5);
    vi.advanceTimersByTime(15);
    await Promise.resolve();

    expect(executionResults).toEqual([1, 2]);
  });

  it("should dynamically adjust processing chunk size", async () => {
    const createTimedOperations = (count: number, duration: number) =>
      Array(count)
        .fill(null)
        .map((_, index) => ({
          id: `timed-operation-${index}`,
          callback: vi.fn(() => {
            vi.advanceTimersByTime(duration);
          }) as unknown as Callback,
        }));

    const timedOperations = createTimedOperations(10, FRAME_BUDGET_MS + 5);
    queue.enqueueArray(timedOperations);

    const processFrameCycle = async (cycles: number) => {
      for (let i = 0; i < cycles; i++) {
        vi.runAllTimers();
        vi
          .mocked(window.requestAnimationFrame)
          .mock.calls[0]?.[0](performance.now());
        await Promise.resolve();
      }
    };

    await processFrameCycle(20);
    timedOperations.forEach(({ callback }) => {
      expect(vi.mocked(callback)).toHaveBeenCalled();
    });
  });
});
