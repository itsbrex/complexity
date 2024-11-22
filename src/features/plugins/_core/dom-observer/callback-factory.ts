import debounce from "lodash/debounce";

import {
  DomObserverConfig,
  MutationCallback,
} from "@/features/plugins/_core/dom-observer/dom-observer.types";
import DomObserver from "@/features/plugins/_core/dom-observer/DomObserver";
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
  let debouncedCallback: MutationCallback | null = null;
  let currentDebounceTime: number | null = null;

  const processChunk = async (
    mutations: MutationRecord[],
    observer: MutationObserver,
  ) => {
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
    const debounceTime = 0;

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
        },
      );
    }

    debouncedCallback(mutations, observer);
  };

  return callback;
};
