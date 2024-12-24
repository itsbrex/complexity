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
    <CommandGroup
      heading={t(
        "plugin-slash-command-menu:slashCommandMenu.filterItems.heading",
      )}
    >
      {FILTER_ITEMS.map((item, idx) => (
        <CommandItem
          key={idx}
          value={item.command}
          keywords={item.keywords ?? item.label.split(" ")}
          className="tw-min-h-10"
          onSelect={() => {
            setFilter(item.filter);
            slashCommandMenuStore.getState().queryBoxAction.clearSearchValue();
          }}
        >
          <div className="tw-flex tw-items-center tw-gap-2">
            <div className="tw-flex tw-items-center tw-gap-2">
              {item.Icon && <item.Icon className="tw-size-4" />}
              <div>{item.label}</div>
            </div>
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
