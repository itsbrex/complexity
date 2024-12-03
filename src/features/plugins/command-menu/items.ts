import { LuComputer, LuMoon, LuSettings, LuSun } from "react-icons/lu";
import { SiPerplexity } from "react-icons/si";

import PplxDiscover from "@/components/icons/PplxDiscover";
import PplxLabs from "@/components/icons/PplxLabs";
import PplxLibrary from "@/components/icons/PplxLibrary";
import PplxSpace from "@/components/icons/PplxSpace";
import PplxThread from "@/components/icons/PplxThread";
import type {
  ColorSchemeItem,
  NavigationItem,
  SearchItem,
} from "@/features/plugins/command-menu/types";

export type SearchFilter = "threads" | "spaces" | "spaces-threads";

export const SEARCH_FILTERS: Record<
  SearchFilter,
  {
    code: SearchFilter;
    label: string;
    searchPlaceholder: string;
  }
> = {
  threads: {
    code: "threads",
    label: t("plugin-command-menu:commandMenu.filters.threads.label"),
    searchPlaceholder: t(
      "plugin-command-menu:commandMenu.filters.threads.searchPlaceholder",
    ),
  },
  spaces: {
    code: "spaces",
    label: t("plugin-command-menu:commandMenu.filters.spaces.label"),
    searchPlaceholder: t(
      "plugin-command-menu:commandMenu.filters.spaces.searchPlaceholder",
    ),
  },
  "spaces-threads": {
    code: "spaces-threads",
    label: "",
    searchPlaceholder: "",
  },
};

export const SEARCH_ITEMS: SearchItem[] = [
  {
    icon: PplxThread,
    code: SEARCH_FILTERS.threads.code,
    label: t("plugin-command-menu:commandMenu.filters.threads.label"),
    keywords: ["threads"],
    shortcut: ["Ctrl", "Alt", "T"],
  },
  {
    icon: PplxSpace,
    code: SEARCH_FILTERS.spaces.code,
    label: t("plugin-command-menu:commandMenu.filters.spaces.label"),
    keywords: ["spaces"],
    shortcut: ["Ctrl", "Alt", "S"],
  },
];

SEARCH_ITEMS.forEach((item) => item.keywords.push("search"));

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    icon: SiPerplexity,
    label: t("plugin-command-menu:commandMenu.navigation.home"),
    path: "/",
    keywords: ["home"],
    whereAmI: "home",
  },
  {
    icon: PplxDiscover,
    label: t("plugin-command-menu:commandMenu.navigation.discover"),
    path: "/discover",
    keywords: ["discover"],
    whereAmI: "discover",
  },
  {
    icon: PplxLibrary,
    label: t("plugin-command-menu:commandMenu.navigation.library"),
    path: "/library",
    keywords: ["library"],
    whereAmI: "library",
  },
  {
    icon: LuSettings,
    label: t("plugin-command-menu:commandMenu.navigation.userSettings"),
    path: "/settings/account",
    keywords: ["user", "settings"],
    whereAmI: "settings",
  },
  {
    icon: PplxLabs,
    label: t("plugin-command-menu:commandMenu.navigation.labs"),
    path: "https://labs.perplexity.ai/",
    keywords: ["labs"],
    external: true,
    whereAmI: "unknown",
  },
];

NAVIGATION_ITEMS.forEach((item) => item.keywords.push("navigate"));

export const COLOR_SCHEME_ITEMS: ColorSchemeItem[] = [
  {
    scheme: "dark",
    icon: LuMoon,
    label: t("plugin-command-menu:commandMenu.colorSchemes.dark"),
    keywords: ["dark", "theme"],
  },
  {
    scheme: "light",
    icon: LuSun,
    label: t("plugin-command-menu:commandMenu.colorSchemes.light"),
    keywords: ["light", "theme"],
  },
  {
    scheme: "system",
    icon: LuComputer,
    label: t("plugin-command-menu:commandMenu.colorSchemes.system"),
    keywords: ["system", "theme"],
  },
];

COLOR_SCHEME_ITEMS.forEach((item) =>
  item.keywords.push(..."change color scheme".split(" ")),
);
