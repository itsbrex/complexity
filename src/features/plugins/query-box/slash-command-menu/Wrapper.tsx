import { usePopover } from "@ark-ui/react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { PopoverContent, PopoverRootProvider } from "@/components/ui/popover";
import { useScopedQueryBoxContext } from "@/features/plugins/query-box/context/context";
import PromptHistorySlashMenuItemsWrapper from "@/features/plugins/query-box/prompt-history/Wrapper";
import ActionItems from "@/features/plugins/query-box/slash-command-menu/ActionItems";
import FilterItems, {
  FilterMode,
} from "@/features/plugins/query-box/slash-command-menu/FilterItems";
import { useSlashCommandMenuStore } from "@/features/plugins/query-box/slash-command-menu/store";
import useQueryBoxObserver from "@/features/plugins/query-box/slash-command-menu/useQueryBoxObserver";
import UiUtils from "@/utils/UiUtils";

type SlashCommandMenuWrapperProps = {
  anchor: HTMLElement | null;
};

export default function SlashCommandMenuWrapper({
  anchor,
}: SlashCommandMenuWrapperProps) {
  const { store } = useScopedQueryBoxContext();

  const isMainQueryBox = store.type === "main";
  const isSpaceQueryBox = store.type === "space";
  const isActive = UiUtils.getActiveQueryBox()[0] === anchor;

  const { isOpen } = useSlashCommandMenuStore();
  const commandRef = useRef<HTMLDivElement>(null);
  const commandInputRef = useRef<HTMLInputElement>(null);

  useQueryBoxObserver({ queryBoxAnchor: anchor, commandRef, commandInputRef });
  const popover = useSlashCommandPopover({
    anchor,
    isMainQueryBox,
    isSpaceQueryBox,
  });

  if (!anchor || !document.contains(anchor) || !isActive) return null;

  if (isMainQueryBox) {
    $(anchor).find(">div").toggleClass("[&>div]:!tw-rounded-t-none", isOpen);
  }

  return (
    <PopoverRootProvider value={popover} unmountOnExit={true} lazyMount={true}>
      <CommandContent
        commandRef={commandRef}
        commandInputRef={commandInputRef}
        anchor={anchor}
      />
    </PopoverRootProvider>
  );
}

const DONT_FILTER_ITEM_FILTER_MODES: FilterMode[] = ["promptHistory"];

const useSlashCommandPopover = ({
  anchor,
  isMainQueryBox,
  isSpaceQueryBox,
}: {
  anchor: HTMLElement | null;
  isMainQueryBox: boolean;
  isSpaceQueryBox: boolean;
}) => {
  const { isOpen } = useSlashCommandMenuStore();

  return usePopover({
    open: isOpen,
    positioning: {
      placement: isSpaceQueryBox ? "bottom-start" : "top-start",
      gutter: isMainQueryBox ? 1 : 5,
      getAnchorRect: () => anchor?.getBoundingClientRect() ?? null,
    },
    portalled: false,
    autoFocus: false,
    modal: false,
  });
};

type CommandContentProps = {
  commandRef: React.RefObject<HTMLDivElement | null>;
  commandInputRef: React.RefObject<HTMLInputElement | null>;
  anchor: HTMLElement;
};

const CommandContent = ({
  commandRef,
  commandInputRef,
  anchor,
}: CommandContentProps) => {
  const { store } = useScopedQueryBoxContext();

  const { selectedValue, setSelectedValue, searchValue, filter } =
    useSlashCommandMenuStore();

  const shouldFilter = !(
    filter != null && DONT_FILTER_ITEM_FILTER_MODES.includes(filter)
  );

  return (
    <PopoverContent
      ref={commandRef}
      className={cn(
        "tw-overflow-y-auto tw-border-border tw-p-0 tw-shadow-none",
        {
          "tw-rounded-b-none tw-border-2 tw-border-b-0": store.type === "main",
        },
      )}
      portal={false}
      style={{ width: anchor.clientWidth }}
    >
      <Command
        filter={(value, search, keywords) => {
          const shouldIncludeKeywords = filter == null && search.length <= 1;
          const extendValue = shouldIncludeKeywords
            ? value
            : value +
              (keywords?.join("") ?? "").replace(/\s+/g, "").toLowerCase();
          const normalizedSearch = search.replace(/\s+/g, "").toLowerCase();

          return extendValue.includes(normalizedSearch) ? 1 : 0;
        }}
        shouldFilter={shouldFilter}
        value={selectedValue}
        className={cn("tw-bg-background dark:tw-bg-secondary", {
          "tw-rounded-b-none": store.type === "main",
        })}
        onValueChange={setSelectedValue}
      >
        <CommandInput
          ref={commandInputRef}
          value={searchValue}
          className="tw-hidden"
          onKeyDown={(e) => {
            if (e.key === Key.Enter) return;

            const commandItems =
              commandRef.current?.querySelectorAll("[cmdk-item]");
            commandItems?.forEach((item) => {
              if (item.getAttribute("aria-selected") === "true") {
                item.dispatchEvent(new KeyboardEvent("keydown", e as any));
              }
            });
          }}
        />
        <CommandList className="tw-max-h-[200px]">
          <CommandEmpty>No results found</CommandEmpty>

          {filter === null && (
            <CommandGroup>
              <FilterItems />
              <ActionItems />
            </CommandGroup>
          )}

          {filter === "promptHistory" && <PromptHistorySlashMenuItemsWrapper />}
        </CommandList>
      </Command>
    </PopoverContent>
  );
};
