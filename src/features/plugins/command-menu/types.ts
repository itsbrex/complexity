import type { IconType } from "react-icons";

import { SearchFilter } from "@/features/plugins/command-menu/items";
import { whereAmI } from "@/utils/utils";

export type ColorScheme = "dark" | "light" | "system";

export type BaseItem = {
  icon: IconType;
  label: string;
  keywords: string[];
  shortcut?: string[];
};

export type SearchItem = BaseItem & {
  code: SearchFilter;
};

export type NavigationItem = BaseItem & {
  path?: string;
  external?: boolean;
  whereAmI: ReturnType<typeof whereAmI>;
};

export type ColorSchemeItem = BaseItem & {
  scheme: ColorScheme;
};
