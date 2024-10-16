import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

const MOBILE_BREAKPOINT = 768;

type IsMobileStore = {
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
};

const useIsMobileStore = createWithEqualityFn<IsMobileStore>()(
  subscribeWithSelector(
    immer(
      (set): IsMobileStore => ({
        isMobile: window.innerWidth < MOBILE_BREAKPOINT,
        setIsMobile: (isMobile) => set({ isMobile }),
      }),
    ),
  ),
);

const isMobileStore = useIsMobileStore;

function initIsMobileStore() {
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
  const onChange = () => {
    isMobileStore.setState({ isMobile: window.innerWidth < MOBILE_BREAKPOINT });
  };
  mql.addEventListener("change", onChange);
}

initIsMobileStore();

export { isMobileStore, useIsMobileStore };
