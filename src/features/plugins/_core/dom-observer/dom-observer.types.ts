export type MutationCallback = (
  mutations: MutationRecord[],
  observer: MutationObserver,
) => void | Promise<void>;

export type MutationConfig = MutationObserverInit;

export type DomObserverConfig = {
  target: Element | null;
  config: MutationConfig;
  debounceTime?: number;
  onMutation?: MutationCallback;
};

export type DomObserverInstance = {
  observer: MutationObserver;
  config: DomObserverConfig;
  isPaused: boolean;
};
