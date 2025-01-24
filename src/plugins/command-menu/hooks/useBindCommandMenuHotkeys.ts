import { useHotkeys } from "react-hotkeys-hook";

import { SearchFilter } from "@/data/plugins/command-menu/items";
import {
  commandMenuStore,
  useCommandMenuStore,
} from "@/data/plugins/command-menu/store";
import { getPlatform } from "@/hooks/usePlatformDetection";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";
import { PluginsStatesService } from "@/services/plugins-states";
import { keysToString } from "@/utils/utils";

export default function useBindCommandMenuHotkeys() {
  const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

  const settings = ExtensionLocalStorageService.getCachedSync();

  const state = useCommandMenuStore();

  const [historyPosition, setHistoryPosition] = useState(-1);
  const [filterHistory, setFilterHistory] = useState<(SearchFilter | null)[]>(
    [],
  );

  const { open, setOpen, filter } = state;

  const activationHotkey = settings.plugins.commandMenu.hotkey ?? [];

  useHotkeys(
    keysToString(activationHotkey),
    (e) => {
      e.stopImmediatePropagation();
      setOpen(!open);
    },
    {
      preventDefault: true,
      enableOnContentEditable: true,
      enableOnFormTags: true,
    },
    [activationHotkey],
  );

  useEffect(() => {
    setFilterHistory((prev) => {
      if (prev[historyPosition] === filter) {
        return prev;
      }

      const newHistory = prev.slice(0, historyPosition + 1);
      const updatedHistory = [...newHistory, filter];
      setHistoryPosition(updatedHistory.length - 1);
      return updatedHistory;
    });
  }, [filter, historyPosition]);

  useHotkeys(
    [
      keysToString([Key.Alt, Key.ArrowLeft]),
      keysToString([Key.Alt, Key.ArrowRight]),
    ],
    (e) => {
      if (filterHistory.length < 2) return;

      const isBackward = e.key === "ArrowLeft";
      const newPosition = isBackward
        ? Math.max(0, historyPosition - 1)
        : Math.min(filterHistory.length - 1, historyPosition + 1);

      if (newPosition === historyPosition) return;

      setHistoryPosition(newPosition);
      commandMenuStore.setState({
        filter: filterHistory[newPosition],
      });
    },
    {
      enabled: open,
      preventDefault: true,
      enableOnContentEditable: true,
      enableOnFormTags: true,
    },
  );

  useHotkeys(
    keysToString([
      getPlatform() === "mac" ? Key.Meta : Key.Control,
      Key.Alt,
      "z",
    ]),
    () => {
      const previousZenMode = $("body").attr("data-cplx-zen-mode");
      const newZenMode = previousZenMode === "true" ? "false" : "true";
      $("body").attr("data-cplx-zen-mode", newZenMode);
      if (
        ExtensionLocalStorageService.getCachedSync()?.plugins["zenMode"]
          .persistent
      ) {
        ExtensionLocalStorageService.set((draft) => {
          draft.plugins["zenMode"].lastState = newZenMode === "true";
        });
      }
      setOpen(false);
    },
    {
      enabled: pluginsEnableStates?.["zenMode"],
      preventDefault: true,
      enableOnContentEditable: true,
      enableOnFormTags: true,
    },
  );
}
