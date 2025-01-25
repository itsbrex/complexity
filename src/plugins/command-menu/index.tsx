import { Trans } from "react-i18next";

import CsUiPluginsGuard from "@/components/plugins-guard/CsUiPluginsGuard";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { InlineCode } from "@/components/ui/typography";
import {
  ZENMODE_ITEMS,
  COLOR_SCHEME_ITEMS,
  NAVIGATION_ITEMS,
  SEARCH_FILTERS,
  SEARCH_ITEMS,
} from "@/data/plugins/command-menu/items";
import { useCommandMenuStore } from "@/data/plugins/command-menu/store";
import ColorSchemeItem from "@/plugins/command-menu/components/ColorSchemeItem";
import NavigationItem from "@/plugins/command-menu/components/NavigationItem";
import SearchFilterBadge from "@/plugins/command-menu/components/SearchFilterBadge";
import SearchItem from "@/plugins/command-menu/components/SearchItem";
import SpaceSearchItems from "@/plugins/command-menu/components/space-search-items/SpaceSearchItems";
import SpaceThreadsSearchItems from "@/plugins/command-menu/components/space-search-items/SpaceThreadsSearchItems";
import ThreadSearchItems from "@/plugins/command-menu/components/thread-search-items/ThreadSearchItems";
import ZenModeItem from "@/plugins/command-menu/components/ZenModeItem";
import useBindCommandMenuHotkeys from "@/plugins/command-menu/hooks/useBindCommandMenuHotkeys";

export default function CommandMenuWrapper() {
  const {
    open,
    setOpen,
    searchValue,
    setSearchValue,
    selectedValue,
    setSelectedValue,
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
      open={open}
      preventScroll={false}
      commandProps={{
        value: selectedValue,
        onValueChange: setSelectedValue,
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
      <div className="x-flex x-items-center x-border-b x-border-border/50">
        <SearchFilterBadge />
        <CommandInput
          ref={ref}
          className={cn("x-grow x-border-none", {
            "x-font-medium": !searchValue,
          })}
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
        {filter && (
          <CsUiPluginsGuard
            requiresLoggedIn
            fallback={<CommandEmpty>Please sign in</CommandEmpty>}
          >
            <ThreadSearchItems />
            <SpaceSearchItems />
            <SpaceThreadsSearchItems />
          </CsUiPluginsGuard>
        )}

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

            <CsUiPluginsGuard dependentPluginIds={["zenMode"]}>
              <CommandGroup
                heading={t("plugin-command-menu:commandMenu.groups.zenMode")}
              >
                {ZENMODE_ITEMS.map((item, idx) => (
                  <ZenModeItem key={idx} {...item} />
                ))}
              </CommandGroup>
            </CsUiPluginsGuard>

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
