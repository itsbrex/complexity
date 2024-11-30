import { useHotkeys } from "react-hotkeys-hook";

import { useCommandMenuStore } from "@/features/plugins/command-menu/store";

export default function useBindCommandMenuHotkeys() {
  const { open, setOpen, filter, setFilter } = useCommandMenuStore();

  useHotkeys("ctrl+k", () => setOpen(!open), {
    preventDefault: true,
    enableOnContentEditable: true,
    enableOnFormTags: true,
  });

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
