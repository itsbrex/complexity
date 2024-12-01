import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { InlineCode } from "@/components/ui/typography";
import ColorSchemeItem from "@/features/plugins/command-menu/components/ColorSchemeItem";
import NavigationItem from "@/features/plugins/command-menu/components/NavigationItem";
import SearchFilterBadge from "@/features/plugins/command-menu/components/SearchFilterBadge";
import SearchItem from "@/features/plugins/command-menu/components/SearchItem";
import SpaceSearchItems from "@/features/plugins/command-menu/components/space-search-items/SpaceSearchItems";
import SpaceThreadsSearchItems from "@/features/plugins/command-menu/components/space-search-items/SpaceThreadsSearchItems";
import ThreadSearchItems from "@/features/plugins/command-menu/components/thread-search-items/ThreadSearchItems";
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
    if (searchValue.startsWith("thread")) {
      setFilter("threads");
      setSearchValue(searchValue.slice("thread".length));
    }

    if (searchValue.startsWith("space")) {
      setFilter("spaces");
      setSearchValue(searchValue.slice("space".length));
      return;
    }
  }, [searchValue, setFilter, setSearchValue]);

  return (
    <CommandDialog
      lazyMount
      unmountOnExit
      open={open}
      commandProps={{
        filter(value, search, keywords) {
          const extendValue = value + (keywords?.join("") ?? "");

          const normalizedSearch = search.replace(/\s+/g, "").toLowerCase();

          if (extendValue.includes(normalizedSearch)) return 1;
          return 0;
        },
        shouldFilter: filter !== "threads",
      }}
      onOpenChange={({ open }) => setOpen(open)}
    >
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
        <ThreadSearchItems />
        <SpaceSearchItems />
        <SpaceThreadsSearchItems />

        {!filter && (
          <>
            <CommandEmpty>
              No results found for <InlineCode>{searchValue}</InlineCode>.
            </CommandEmpty>
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
