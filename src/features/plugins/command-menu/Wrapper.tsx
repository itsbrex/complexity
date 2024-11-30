import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import ColorSchemeItem from "@/features/plugins/command-menu/components/ColorSchemeItem";
import NavigationItem from "@/features/plugins/command-menu/components/NavigationItem";
import SearchFilterBadge from "@/features/plugins/command-menu/components/SearchFilterBadge";
import SearchItem from "@/features/plugins/command-menu/components/SearchItem";
import useBindCommandMenuHotkeys from "@/features/plugins/command-menu/hooks/useBindCommandMenuHotkeys";
import {
  COLOR_SCHEME_ITEMS,
  NAVIGATION_ITEMS,
  SEARCH_FILTERS,
  SEARCH_ITEMS,
} from "@/features/plugins/command-menu/items";
import { useCommandMenuStore } from "@/features/plugins/command-menu/store";

export default function CommandMenuWrapper() {
  const { open, setOpen, searchValue, setSearchValue, filter, setFilter } =
    useCommandMenuStore();

  useBindCommandMenuHotkeys();

  useEffect(() => {
    setOpen(true);
  }, [setOpen]);

  return (
    <CommandDialog open={open} onOpenChange={({ open }) => setOpen(open)}>
      <div className="tw-flex tw-items-center tw-border-b tw-border-border/50">
        <SearchFilterBadge />
        <CommandInput
          className="tw-grow tw-border-none"
          placeholder={
            !filter
              ? "Type a command or search..."
              : SEARCH_FILTERS[filter].searchPlaceholder
          }
          searchIcon={false}
          value={searchValue}
          onValueChange={setSearchValue}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && searchValue.length === 0) {
              setFilter(null);
            }
          }}
        />
      </div>
      <CommandList>
        <CommandEmpty>
          No{" "}
          {filter
            ? SEARCH_FILTERS[filter].label.toLocaleLowerCase()
            : "results"}{" "}
          found for{" "}
          <span className="rounded-md tw-border tw-border-border/50 tw-bg-secondary tw-px-1 tw-font-mono tw-text-[.7rem] tw-text-secondary-foreground">
            {searchValue}
          </span>
          .
        </CommandEmpty>

        {(!filter || searchValue.length === 0) && (
          <>
            <CommandGroup heading="Search">
              {SEARCH_ITEMS.map((item) => (
                <SearchItem key={item.label} {...item} />
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Quick navigations">
              {NAVIGATION_ITEMS.map((item) => (
                <NavigationItem key={item.label} {...item} />
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Change color scheme">
              {COLOR_SCHEME_ITEMS.map((item) => (
                <ColorSchemeItem key={item.label} {...item} />
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
