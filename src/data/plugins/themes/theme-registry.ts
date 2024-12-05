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
    description: "Official theme with signature blue accent color",
    author: "pnd280",
    compatibleWith: ["desktop", "mobile"],
    colorScheme: ["dark"],
    css: complexityBase + "\n" + complexityBlue,
  },
  {
    id: "complexity-perplexity",
    title: "Perplexity Default",
    description: "Enhance the default theme",
    author: "pnd280",
    compatibleWith: ["desktop", "mobile"],
    colorScheme: ["light", "dark"],
    css: complexityBase,
  },
  {
    id: "complexity-shy-moment",
    title: "Shy Moment",
    description: "Official theme with purple-ish accent color",
    author: "pnd280",
    compatibleWith: ["desktop", "mobile"],
    colorScheme: ["dark"],
    css: complexityBase + "\n" + shyMoment,
  },
  {
    id: "complexity-sour-lemon",
    title: "Sour Lemon",
    description: "Official theme with yellow-ish accent color",
    author: "pnd280",
    compatibleWith: ["desktop", "mobile"],
    colorScheme: ["dark"],
    css: complexityBase + "\n" + sourLemon,
  },
];
