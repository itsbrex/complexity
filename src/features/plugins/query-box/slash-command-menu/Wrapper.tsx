import { usePopover } from "@ark-ui/react";
import { useEffect, useRef } from "react";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { PopoverContent, PopoverRootProvider } from "@/components/ui/popover";
import { OBSERVER_ID } from "@/features/plugins/_core/dom-observer/observers/query-boxes/observer-ids";
import PromptHistorySlashMenuItemsWrapper from "@/features/plugins/query-box/prompt-history/Wrapper";
import ActionItems from "@/features/plugins/query-box/slash-command-menu/ActionItems";
import { FilterMode } from "@/features/plugins/query-box/slash-command-menu/filter-items";
import FilterItems from "@/features/plugins/query-box/slash-command-menu/FilterItems";
import { useSlashCommandMenuStore } from "@/features/plugins/query-box/slash-command-menu/store";
import useQueryBoxObserver from "@/features/plugins/query-box/slash-command-menu/useQueryBoxObserver";
import UiUtils from "@/utils/UiUtils";

type SlashCommandMenuWrapperProps = {
  anchor: HTMLElement | null;
};

export default function SlashCommandMenuWrapper({
  anchor,
}: SlashCommandMenuWrapperProps) {
  const isMainQueryBox =
    anchor?.getAttribute(OBSERVER_ID.MAIN_QUERY_BOX) === "true";
  const isActive = UiUtils.getActiveQueryBox()[0] === anchor;

  const { isOpen } = useSlashCommandMenuStore();
  const commandRef = useRef<HTMLDivElement>(null);
  const commandInputRef = useRef<HTMLInputElement>(null);

  useQueryBoxObserver({ queryBoxAnchor: anchor, commandRef, commandInputRef });
  const popover = useSlashCommandPopover({ anchor, isMainQueryBox });

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
        isMainQueryBox={isMainQueryBox}
      />
    </PopoverRootProvider>
  );
}

const DONT_FILTER_ITEM_FILTER_MODES: FilterMode[] = ["promptHistory"];

const useSlashCommandPopover = ({
  anchor,
  isMainQueryBox,
}: {
  anchor: HTMLElement | null;
  isMainQueryBox: boolean;
}) => {
  const { isOpen } = useSlashCommandMenuStore();

  const popover = usePopover({
    open: isOpen,
    positioning: {
      placement: "top-start",
      gutter: isMainQueryBox ? 0 : 5,
      getAnchorRect: () => anchor?.getBoundingClientRect() ?? null,
    },
    portalled: false,
    autoFocus: false,
    modal: false,
  });

  useEffect(() => {
    popover.reposition({
      getAnchorRect: () => anchor?.getBoundingClientRect() ?? null,
    });
  });

  return popover;
};

type CommandContentProps = {
  commandRef: React.RefObject<HTMLDivElement | null>;
  commandInputRef: React.RefObject<HTMLInputElement | null>;
  anchor: HTMLElement;
  isMainQueryBox: boolean;
};

const CommandContent = ({
  commandRef,
  commandInputRef,
  anchor,
  isMainQueryBox,
}: CommandContentProps) => {
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
          "tw-rounded-b-none tw-border-2 tw-border-b-0": isMainQueryBox,
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
        className="tw-bg-secondary"
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
            <>
              <FilterItems />
              <ActionItems />
            </>
          )}

          {filter === "promptHistory" && <PromptHistorySlashMenuItemsWrapper />}
        </CommandList>
      </Command>
    </PopoverContent>
  );
};
