import {
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command";
import { FILTER_ITEMS } from "@/features/plugins/query-box/slash-command-menu/filter-items";
import {
  slashCommandMenuStore,
  useSlashCommandMenuStore,
} from "@/features/plugins/query-box/slash-command-menu/store";

export default function ActionItems() {
  const { setFilter } = useSlashCommandMenuStore();

  return (
    <CommandGroup heading="Filter">
      {FILTER_ITEMS.map((item) => (
        <CommandItem
          key={item.label}
          value={item.command}
          keywords={item.keywords ?? item.label.split(" ")}
          className="tw-min-h-10"
          onSelect={() => {
            setFilter(item.filter);
            slashCommandMenuStore.getState().queryBoxAction.clearSearchValue();
          }}
        >
          <div className="tw-flex tw-items-center tw-gap-2">
            <div>{item.label}</div>
            {item.description && (
              <div className="tw-text-muted-foreground">
                ({item.description})
              </div>
            )}
          </div>
          <CommandShortcut>/{item.command}</CommandShortcut>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}
