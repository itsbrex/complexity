import { Trans } from "react-i18next";

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
import usePplxAuth from "@/hooks/usePplxAuth";

export default function CommandMenuWrapper() {
  const { isLoggedIn } = usePplxAuth();

  const {
    open,
    setOpen,
    searchValue,
    setSearchValue,
    filter,
    setFilter,
    setInputRef,
  } = useCommandMenuStore();

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

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setInputRef(ref);
    }
  }, [open, setInputRef]);

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
          ref={ref}
          className="tw-grow tw-border-none"
          placeholder={
            !filter
              ? t("plugin-command-menu:commandMenu.input.placeholder")
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
        {filter &&
          (isLoggedIn ? (
            <>
              <ThreadSearchItems />
              <SpaceSearchItems />
              <SpaceThreadsSearchItems />
            </>
          ) : (
            <CommandEmpty>Please sign in</CommandEmpty>
          ))}

        {!filter && (
          <>
            <CommandEmpty>
              <Trans
                i18nKey="plugin-command-menu:commandMenu.noResults"
                components={{
                  emphasis: <InlineCode />,
                }}
                values={{
                  code: searchValue,
                }}
              />
            </CommandEmpty>
            <CommandGroup
              heading={t("plugin-command-menu:commandMenu.groups.search")}
            >
              {SEARCH_ITEMS.map((item, idx) => (
                <SearchItem key={idx} {...item} />
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup
              heading={t(
                "plugin-command-menu:commandMenu.groups.quickNavigations",
              )}
            >
              {NAVIGATION_ITEMS.map((item, idx) => (
                <NavigationItem key={idx} {...item} />
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup
              heading={t("plugin-command-menu:commandMenu.groups.colorScheme")}
            >
              {COLOR_SCHEME_ITEMS.map((item, idx) => (
                <ColorSchemeItem key={idx} {...item} />
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
