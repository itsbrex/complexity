import { usePopover } from "@ark-ui/react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { PopoverContent, PopoverRootProvider } from "@/components/ui/popover";
import { QueryBoxType } from "@/data/plugins/query-box/types";
import { useScopedQueryBoxContext } from "@/plugins/_core/ui-groups/query-box/context/context";
import PromptHistorySlashMenuItemsWrapper from "@/plugins/prompt-history";
import ActionItems from "@/plugins/slash-command-menu/ActionItems";
import FilterItems from "@/plugins/slash-command-menu/FilterItems";
import { useSlashCommandMenuStore } from "@/plugins/slash-command-menu/store";
import { useCommandFilter } from "@/plugins/slash-command-menu/useCommandFilter";
import useQueryBoxObserver from "@/plugins/slash-command-menu/useQueryBoxObserver";
import {
  getPopoverContentClasses,
  handleCommandInputKeyDown,
} from "@/plugins/slash-command-menu/utils";
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
    $(anchor).find(">div").toggleClass("[&>div]:!tw-rounded-t-none", isOpen);
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

const useSlashCommandPopover = ({ anchor }: { anchor: HTMLElement | null }) => {
  const { store } = useScopedQueryBoxContext();

  const isMainQueryBox = store.type === "main";
  const isSpaceQueryBox = store.type === "space";

  const { isOpen } = useSlashCommandMenuStore();

  return usePopover({
    open: isOpen,
    positioning: {
      placement: isSpaceQueryBox ? "bottom-start" : "top-start",
      gutter: isMainQueryBox ? 1 : 5,
      flip: isSpaceQueryBox ? true : false,
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
  storeType: QueryBoxType;
};

const CommandInputHandler = ({
  commandRef,
  commandInputRef,
}: Pick<CommandContentProps, "commandRef" | "commandInputRef">) => {
  const { searchValue } = useSlashCommandMenuStore();

  return (
    <CommandInput
      ref={commandInputRef}
      value={searchValue}
      className="tw-hidden"
      onKeyDown={handleCommandInputKeyDown(commandRef)}
    />
  );
};

const DefaultCommandGroup = () => (
  <CommandGroup>
    <FilterItems />
    <ActionItems />
  </CommandGroup>
);

const CommandContent = (props: CommandContentProps) => {
  const { storeType } = props;
  const {
    selectedValue,
    actions: { setSelectedValue },
    filter,
  } = useSlashCommandMenuStore();
  const { shouldFilterItems, calculateFilterScore } = useCommandFilter();

  return (
    <PopoverContent
      ref={props.commandRef}
      className={getPopoverContentClasses(storeType)}
      portal={false}
      style={{ width: props.anchor.clientWidth }}
    >
      <Command
        filter={(...props) => {
          return calculateFilterScore(...props, filter);
        }}
        shouldFilter={shouldFilterItems(filter)}
        value={selectedValue}
        className={cn("tw-bg-background dark:tw-bg-secondary", {
          "tw-rounded-b-none": storeType === "main",
        })}
        onValueChange={setSelectedValue}
      >
        <CommandInputHandler {...props} />
        <CommandList className="tw-max-h-[200px]">
          <CommandEmpty>No results found</CommandEmpty>
          {!filter && <DefaultCommandGroup />}
          {filter === "promptHistory" && <PromptHistorySlashMenuItemsWrapper />}
        </CommandList>
      </Command>
    </PopoverContent>
  );
};
