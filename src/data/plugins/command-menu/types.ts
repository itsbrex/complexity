import type { IconType } from "react-icons";

import { ColorScheme } from "@/data/color-scheme-store";
import { SearchFilter } from "@/data/plugins/command-menu/items";
import { whereAmI } from "@/utils/utils";

export type BaseItem = {
  icon: IconType;
  label: string;
  keywords: string[];
  shortcut?: string[];
};

export type ZenModeItem = BaseItem & {
  type: "enable" | "disable";
  action: () => void;
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
