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

export type SearchFilter = "threads" | "spaces";

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
    label: "Threads",
    searchPlaceholder: "Search threads...",
  },
  spaces: {
    code: "spaces",
    label: "Spaces",
    searchPlaceholder: "Search spaces...",
  },
};

export const SEARCH_ITEMS: SearchItem[] = [
  {
    icon: PplxThread,
    code: SEARCH_FILTERS.threads.code,
    label: SEARCH_FILTERS.threads.label,
    keywords: ["threads"],
    shortcut: ["Ctrl", "Alt", "T"],
  },
  {
    icon: PplxSpace,
    code: SEARCH_FILTERS.spaces.code,
    label: SEARCH_FILTERS.spaces.label,
    keywords: ["spaces"],
    shortcut: ["Ctrl", "Alt", "S"],
  },
];

SEARCH_ITEMS.forEach((item) => item.keywords.push("search"));

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    icon: SiPerplexity,
    label: "Home",
    path: "/",
    keywords: ["home"],
    whereAmI: "home",
  },
  {
    icon: PplxDiscover,
    label: "Discover",
    path: "/discover",
    keywords: ["discover"],
    whereAmI: "discover",
  },
  {
    icon: PplxLibrary,
    label: "Library",
    path: "/library",
    keywords: ["library"],
    whereAmI: "library",
  },
  {
    icon: LuSettings,
    label: "User settings",
    path: "/settings/account",
    keywords: ["user settings"],
    whereAmI: "settings",
  },
  {
    icon: PplxLabs,
    label: "Labs",
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
    label: "Dark",
    keywords: ["dark", "theme"],
  },
  {
    scheme: "light",
    icon: LuSun,
    label: "Light",
    keywords: ["light", "theme"],
  },
  {
    scheme: "system",
    icon: LuComputer,
    label: "System",
    keywords: ["system", "theme"],
  },
];

COLOR_SCHEME_ITEMS.forEach((item) =>
  item.keywords.push(...("change color scheme".split(" "))),
);
