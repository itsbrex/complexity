import complexityBase from "@/data/plugins/themes/css-files/complexity/base.css?inline";
import complexityBlue from "@/data/plugins/themes/css-files/complexity/complexity-blue.css?inline";
import shyMoment from "@/data/plugins/themes/css-files/complexity/shy-moment.css?inline";
import sourLemon from "@/data/plugins/themes/css-files/complexity/sour-lemon.css?inline";
import { Theme } from "@/data/plugins/themes/theme-registry.types";

export type BuiltInThemeId =
  | "complexity"
  | "complexity-perplexity"
  | "complexity-shy-moment"
  | "complexity-sour-lemon";

export const BUILTIN_THEME_REGISTRY: (Theme & { id: BuiltInThemeId })[] = [
  {
    id: "complexity",
    title: "Complexity Blue",
    description: t(
      "dashboard-themes-page:themeRegistry.complexityBlue.description",
    ),
    author: "pnd280",
    compatibleWith: ["desktop", "mobile"],
    colorScheme: ["dark"],
    css: complexityBase + "\n" + complexityBlue,
  },
  {
    id: "complexity-perplexity",
    title: "Perplexity Default",
    description: t(
      "dashboard-themes-page:themeRegistry.perplexityDefault.description",
    ),
    author: "pnd280",
    compatibleWith: ["desktop", "mobile"],
    colorScheme: ["light", "dark"],
    css: complexityBase,
  },
  {
    id: "complexity-shy-moment",
    title: "Shy Moment",
    description: t("dashboard-themes-page:themeRegistry.shyMoment.description"),
    author: "pnd280",
    compatibleWith: ["desktop", "mobile"],
    colorScheme: ["dark"],
    css: complexityBase + "\n" + shyMoment,
  },
  {
    id: "complexity-sour-lemon",
    title: "Sour Lemon",
    description: t("dashboard-themes-page:themeRegistry.sourLemon.description"),
    author: "pnd280",
    compatibleWith: ["desktop", "mobile"],
    colorScheme: ["dark"],
    css: complexityBase + "\n" + sourLemon,
  },
];
