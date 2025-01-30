import { PopoverRootProvider } from "@/components/ui/popover";
import { useScopedQueryBoxContext } from "@/plugins/_core/ui-groups/query-box/context/context";
import { CommandContent } from "@/plugins/slash-command-menu/components/CommandContent";
import { useSlashCommandPopover } from "@/plugins/slash-command-menu/hooks/useSlashCommandPopover";
import { useSlashCommandMenuStore } from "@/plugins/slash-command-menu/store";
import useQueryBoxObserver from "@/plugins/slash-command-menu/useQueryBoxObserver";
import { UiUtils } from "@/utils/ui-utils";

type SlashCommandMenuWrapperProps = {
  anchor: HTMLElement | null;
};

export default function SlashCommandMenuWrapper({
  anchor,
}: SlashCommandMenuWrapperProps) {
  const { store } = useScopedQueryBoxContext();

  const isMainQueryBox = store.type === "main";
  const isActive = UiUtils.getActiveQueryBox()[0] === anchor;

  const { isOpen } = useSlashCommandMenuStore();
  const commandRef = useRef<HTMLDivElement>(null);
  const commandInputRef = useRef<HTMLInputElement>(null);

  useQueryBoxObserver({ queryBoxAnchor: anchor, commandRef, commandInputRef });
  const popover = useSlashCommandPopover({
    anchor,
  });

  if (!anchor || !document.contains(anchor) || !isActive) return null;

  if (isMainQueryBox) {
    $(anchor).find(">div").toggleClass("[&>div]:!x-rounded-t-none", isOpen);
  }

  return (
    <PopoverRootProvider value={popover} unmountOnExit={true} lazyMount={true}>
      <CommandContent
        commandRef={commandRef}
        commandInputRef={commandInputRef}
        anchor={anchor}
        storeType={store.type}
      />
    </PopoverRootProvider>
  );
}
