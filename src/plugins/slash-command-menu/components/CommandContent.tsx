import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandList,
} from "@/components/ui/command";
import { PopoverContent } from "@/components/ui/popover";
import { QueryBoxType } from "@/data/plugins/query-box/types";
import PromptHistorySlashMenuItemsWrapper from "@/plugins/prompt-history";
import ActionItems from "@/plugins/slash-command-menu/ActionItems";
import { CommandInputHandler } from "@/plugins/slash-command-menu/components/CommandInputHandler";
import FilterItems from "@/plugins/slash-command-menu/FilterItems";
import {
  useSlashCommandMenuSelectedValue,
  useSlashCommandMenuActions,
  useSlashCommandMenuFilter,
} from "@/plugins/slash-command-menu/store";
import { useCommandFilter } from "@/plugins/slash-command-menu/useCommandFilter";
import { getPopoverContentClasses } from "@/plugins/slash-command-menu/utils";

type CommandContentProps = {
  commandRef: React.RefObject<HTMLDivElement | null>;
  commandInputRef: React.RefObject<HTMLInputElement | null>;
  anchor: HTMLElement;
  storeType: QueryBoxType;
};

const DefaultCommandGroup = memo(() => (
  <CommandGroup>
    <FilterItems />
    <ActionItems />
  </CommandGroup>
));

DefaultCommandGroup.displayName = "DefaultCommandGroup";

export const CommandContent = memo((props: CommandContentProps) => {
  const { storeType, anchor } = props;
  const selectedValue = useSlashCommandMenuSelectedValue();
  const { setSelectedValue } = useSlashCommandMenuActions();
  const filter = useSlashCommandMenuFilter();

  const { shouldFilterItems, calculateFilterScore } = useCommandFilter();

  const memoizedFilter = useCallback(
    (value: string, search: string) => {
      return calculateFilterScore(value, search, undefined, filter);
    },
    [calculateFilterScore, filter],
  );

  const handleValueChange = useCallback(
    (value: string) => setSelectedValue(value),
    [setSelectedValue],
  );

  return (
    <PopoverContent
      ref={props.commandRef}
      className={getPopoverContentClasses(storeType)}
      portal={false}
      style={{ width: anchor.clientWidth }}
    >
      <Command
        filter={memoizedFilter}
        shouldFilter={shouldFilterItems(filter)}
        value={selectedValue}
        className={cn("x-bg-background dark:x-bg-secondary", {
          "x-rounded-b-none": storeType === "main",
        })}
        onValueChange={handleValueChange}
      >
        <CommandInputHandler {...props} />
        <CommandList className="x-max-h-[200px]">
          <CommandEmpty>No results found</CommandEmpty>
          {!filter && <DefaultCommandGroup />}
          {filter === "promptHistory" && <PromptHistorySlashMenuItemsWrapper />}
        </CommandList>
      </Command>
    </PopoverContent>
  );
});

CommandContent.displayName = "CommandContent";
