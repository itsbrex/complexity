import { useHotkeys } from "react-hotkeys-hook";

import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { getPlatform } from "@/hooks/usePlatformDetection";
import { sharedQueryBoxStore } from "@/plugins/_core/ui-groups/query-box/shared-store";
import { keysToString } from "@/utils/utils";

export default function useBindBetterLanguageModelSelectorHotKeys() {
  const { isMobile } = useIsMobileStore();

  useHotkeys(
    keysToString([getPlatform() === "mac" ? Key.Meta : Key.Control, "."]),
    (e) => {
      e.stopImmediatePropagation();

      sharedQueryBoxStore.setState((state) => {
        state.isProSearchEnabled = !state.isProSearchEnabled;
      });
    },
    {
      enabled: !isMobile,
      preventDefault: true,
      enableOnContentEditable: true,
      enableOnFormTags: true,
    },
  );
}
