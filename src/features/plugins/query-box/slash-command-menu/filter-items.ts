import { ComponentType, SVGProps } from "react";
import { LuHistory } from "react-icons/lu";

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

export const FILTER_ITEMS: CommandFilterItem[] = [
  {
    filter: "promptHistory",
    label: "Prompt History",
    Icon: LuHistory,
    description: "auto-saved prompts",
    command: "h",
  },
];
