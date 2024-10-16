import debounce from "lodash/debounce";

import {
  DomObserverConfig,
  MutationCallback,
} from "@/features/plugins/_core/dom-observer/dom-observer.types";
import DomObserver from "@/features/plugins/_core/dom-observer/DomObserver";
import DynamicDebouncer from "@/features/plugins/_core/dom-observer/DynamicDebouncer";
import { batchMutations } from "@/features/plugins/_core/dom-observer/mutation-batcher";

const handleError = (error: unknown, context: string): void => {
  console.error(
    `Error in ${context}: ${error instanceof Error ? error.message : String(error)}`,
  );
};

const safeExecute = async <T extends unknown[]>(
  fn: (...args: T) => void | Promise<void>,
  ...args: T
): Promise<void> => {
  try {
    const result = fn(...args);
    if (result instanceof Promise) {
      await result;
    }
  } catch (error) {
    handleError(error, fn.name);
  }
};

export const createCallback = (config: DomObserverConfig): MutationCallback => {
  const dynamicDebouncer = DynamicDebouncer.getInstance();
  let debouncedCallback: MutationCallback | null = null;
  let currentDebounceTime: number | null = null;

  const processChunk = async (
    mutations: MutationRecord[],
    observer: MutationObserver,
  ) => {
    // Record mutations for dynamic debouncing
    dynamicDebouncer.recordMutations(mutations.length);

    const batchedMutations = batchMutations(mutations);

    if (config.onMutation) {
      await safeExecute<Parameters<MutationCallback>>(
        config.onMutation,
        batchedMutations,
        observer,
      );
    }
  };

  const callback: MutationCallback = (
    mutations: MutationRecord[],
    observer: MutationObserver,
  ) => {
    // Get current debounce time
    const debounceTime =
      config.debounceTime ?? dynamicDebouncer.getDebounceTime();

    // Create or update debounced callback if debounce time changed
    if (!debouncedCallback || currentDebounceTime !== debounceTime) {
      currentDebounceTime = debounceTime;
      debouncedCallback = debounce(
        (mutations: MutationRecord[], observer: MutationObserver) => {
          DomObserver.updateQueue.enqueue(() =>
            processChunk(mutations, observer),
          );
        },
        debounceTime,
        {
          leading: false,
          trailing: true,
          maxWait: 1000,
        },
      );
    }

    debouncedCallback(mutations, observer);
  };

  return callback;
};
