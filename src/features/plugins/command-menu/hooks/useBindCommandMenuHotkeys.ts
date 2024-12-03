import { useHotkeys } from "react-hotkeys-hook";

import { SearchFilter } from "@/features/plugins/command-menu/items";
import {
  commandMenuStore,
  useCommandMenuStore,
} from "@/features/plugins/command-menu/store";

export default function useBindCommandMenuHotkeys() {
  const state = useCommandMenuStore();

  const [historyPosition, setHistoryPosition] = useState(-1);
  const [filterHistory, setFilterHistory] = useState<(SearchFilter | null)[]>(
    [],
  );

  const { open, setOpen, filter, setFilter } = state;

  useHotkeys("ctrl+k", () => setOpen(!open), {
    preventDefault: true,
    enableOnContentEditable: true,
    enableOnFormTags: true,
  });

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
    ["alt+left", "alt+right"],
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
    "ctrl+alt+t",
    () => {
      if (!open) {
        setOpen(true);
        if (filter === "threads") return;
      }
      setFilter(filter === "threads" ? null : "threads");
    },
    {
      preventDefault: true,
      enableOnContentEditable: true,
      enableOnFormTags: true,
    },
  );

  useHotkeys(
    "ctrl+alt+s",
    () => {
      if (!open) {
        setOpen(true);
        if (filter === "spaces") return;
      }
      setFilter(filter === "spaces" ? null : "spaces");
    },
    {
      preventDefault: true,
      enableOnContentEditable: true,
      enableOnFormTags: true,
    },
  );
}
