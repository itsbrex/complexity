import { ComponentType, SVGProps } from "react";
import { LuHistory } from "react-icons/lu";

import { CsLoaderRegistry } from "@/services/cs-loader-registry";
import { QueryBoxType } from "@/utils/UiUtils.types";

const FILTER_MODES = ["promptHistory"] as const;

export type FilterMode = (typeof FILTER_MODES)[number];

type CommandFilterItem = {
  filter: FilterMode;
  label: string;
  Icon?: ComponentType<SVGProps<SVGSVGElement>>;
  description?: string;
  command: string;
  keywords?: string[];
};

export let FILTER_ITEMS: CommandFilterItem[] = [];

CsLoaderRegistry.register({
  id: "plugin:queryBox:slashCommandMenu:filterItems",
  dependencies: ["lib:i18next"],
  loader: () => {
    FILTER_ITEMS = [
      {
        filter: "promptHistory",
        label: t(
          "plugin-slash-command-menu:slashCommandMenu.filterItems.promptHistory.label",
        ),
        Icon: LuHistory,
        description: t(
          "plugin-slash-command-menu:slashCommandMenu.filterItems.promptHistory.description",
        ),
        command: "h",
      },
    ];
  },
});

export function getFilterItems(queryBoxType: QueryBoxType) {
  return FILTER_ITEMS;
}
