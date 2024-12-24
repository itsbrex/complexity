const FILTER_MODES = ["promptHistory"] as const;

export type FilterMode = (typeof FILTER_MODES)[number];

type CommandFilterItem = {
  filter: FilterMode;
  label: string;
  description?: string;
  command: string;
  keywords?: string[];
};

export const FILTER_ITEMS: CommandFilterItem[] = [
  {
    filter: "promptHistory",
    label: "Prompt History",
    description: "auto-saved prompts",
    command: "h",
  },
];
