import { usePopover } from "@ark-ui/react";

import { useScopedQueryBoxContext } from "@/plugins/_core/ui-groups/query-box/context/context";
import { useSlashCommandMenuStore } from "@/plugins/slash-command-menu/store";
import { getPopoverPositionConfig } from "@/plugins/slash-command-menu/utils";

export const useSlashCommandPopover = (anchor: HTMLElement | null) => {
  const { store } = useScopedQueryBoxContext();
  const { isOpen } = useSlashCommandMenuStore();

  return usePopover({
    open: isOpen,
    positioning: {
      ...getPopoverPositionConfig(store.type),
      getAnchorRect: () => anchor?.getBoundingClientRect() ?? null,
    },
    portalled: false,
    autoFocus: false,
    modal: false,
  });
};
