import { FocusMode } from "@/data/plugins/focus-selector/focus-modes";
import { csLoaderRegistry } from "@/services/cs-loader-registry";

type FocusWebRecencyValue = "ALL" | "DAY" | "WEEK" | "MONTH" | "YEAR";

export type FocusWebRecency = {
  value: FocusWebRecencyValue;
  label: string;
};

export let RECENCIES: FocusWebRecency[] = [
  {
    value: "ALL",
    label: "All Time",
  },
  {
    value: "DAY",
    label: "Today",
  },
  {
    value: "WEEK",
    label: "Last Week",
  },
  {
    value: "MONTH",
    label: "Last Month",
  },
  {
    value: "YEAR",
    label: "Last Year",
  },
] as const;

csLoaderRegistry.register({
  id: "cache:focusWebRecency",
  dependencies: ["lib:i18next"],
  loader: () => {
    RECENCIES = [
      {
        value: "ALL",
        label: t("plugin-focus-selector:focusWebRecencySelector.modes.all"),
      },
      {
        value: "DAY",
        label: t(
          "plugin-focus-selector:focusWebRecencySelector.modes.last24Hours",
        ),
      },
      {
        value: "WEEK",
        label: t(
          "plugin-focus-selector:focusWebRecencySelector.modes.lastWeek",
        ),
      },
      {
        value: "MONTH",
        label: t(
          "plugin-focus-selector:focusWebRecencySelector.modes.lastMonth",
        ),
      },
      {
        value: "YEAR",
        label: t(
          "plugin-focus-selector:focusWebRecencySelector.modes.lastYear",
        ),
      },
    ];
  },
});

export const allowFocusModes: FocusMode["code"][] = [
  "internet",
  "reddit",
  "scholar",
  "youtube",
];

export function isRecencyValue(value: string): value is FocusWebRecencyValue {
  return RECENCIES.some((recency) => recency.value === value);
}
