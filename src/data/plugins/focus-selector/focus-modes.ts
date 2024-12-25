import { ComponentType, SVGProps } from "react";
import { BiNetworkChart } from "react-icons/bi";
import {
  LuBadgePercent,
  LuGlobe,
  LuLibrary,
  LuPen,
  LuPlayCircle,
} from "react-icons/lu";

import { CsLoaderRegistry } from "@/services/cs-loader-registry";

type FocusModeCode =
  | "internet"
  | "writing"
  | "scholar"
  | "wolfram"
  | "youtube"
  | "reddit";

export type FocusMode = {
  label: string;
  code: FocusModeCode;
  description: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export function isFocusModeCode(value: string): value is FocusMode["code"] {
  return FOCUS_MODES.some((mode) => mode.code === value);
}

export let FOCUS_MODES: FocusMode[] = [
  {
    label: "Web",
    code: "internet",
    description: "Search across the entire internet",
    Icon: LuGlobe,
  },
  {
    label: "Writing",
    code: "writing",
    description: "Generate text or chat without searching the web",
    Icon: LuPen,
  },
  {
    label: "Academic",
    code: "scholar",
    description: "Search for published academic papers",
    Icon: LuLibrary,
  },
  {
    label: "Math",
    code: "wolfram",
    description: "Solve equations and find numerical answers",
    Icon: LuBadgePercent,
  },
  {
    label: "Video",
    code: "youtube",
    description: "Discover and watch videos",
    Icon: LuPlayCircle,
  },
  {
    label: "Social",
    code: "reddit",
    description: "Search for discussions and opinions",
    Icon: BiNetworkChart,
  },
];

CsLoaderRegistry.register({
  id: "cache:focusModes",
  dependencies: ["lib:i18next"],
  loader: () => {
    FOCUS_MODES = [
      {
        label: t("plugin-focus-selector:modes.internet"),
        code: "internet",
        description: t("plugin-focus-selector:descriptions.internet"),
        Icon: LuGlobe,
      },
      {
        label: t("plugin-focus-selector:modes.writing"),
        code: "writing",
        description: t("plugin-focus-selector:descriptions.writing"),
        Icon: LuPen,
      },
      {
        label: t("plugin-focus-selector:modes.scholar"),
        code: "scholar",
        description: t("plugin-focus-selector:descriptions.scholar"),
        Icon: LuLibrary,
      },
      {
        label: t("plugin-focus-selector:modes.wolfram"),
        code: "wolfram",
        description: t("plugin-focus-selector:descriptions.wolfram"),
        Icon: LuBadgePercent,
      },
      {
        label: t("plugin-focus-selector:modes.youtube"),
        code: "youtube",
        description: t("plugin-focus-selector:descriptions.youtube"),
        Icon: LuPlayCircle,
      },
      {
        label: t("plugin-focus-selector:modes.reddit"),
        code: "reddit",
        description: t("plugin-focus-selector:descriptions.reddit"),
        Icon: BiNetworkChart,
      },
    ];
  },
});
