import {
  Theme,
  ThemeSchema,
} from "@/data/consts/plugins/themes/theme-registry.types";

export type BuiltInThemeId =
  | "complexity"
  | "complexity-perplexity"
  | "complexity-shy-moment"
  | "complexity-sour-lemon";

export const THEME_REGISTRY: (Theme & { id: BuiltInThemeId })[] = [
  {
    id: "complexity",
    label: "Complexity Blue",
    description: "Official theme with signature blue accent color",
    author: "pnd280",
    isBuiltIn: true,
    compatibleWith: ["desktop", "mobile"],
    colorScheme: ["dark"],
    css: async () =>
      (
        await import(
          "@/data/consts/plugins/themes/css-files/complexity/base.css?inline"
        )
      ).default +
      "\n" +
      (
        await import(
          "@/data/consts/plugins/themes/css-files/complexity/complexity-blue.css?inline"
        )
      ).default,
  },
  {
    id: "complexity-perplexity",
    label: "Perplexity Default",
    description: "Enhance the default theme",
    author: "pnd280",
    isBuiltIn: true,
    compatibleWith: ["desktop", "mobile"],
    colorScheme: ["light", "dark"],
    css: async () =>
      (
        await import(
          "@/data/consts/plugins/themes/css-files/complexity/base.css?inline"
        )
      ).default,
  },
  {
    id: "complexity-shy-moment",
    label: "Shy Moment",
    description: "Official theme with purple-ish accent color",
    author: "pnd280",
    isBuiltIn: true,
    compatibleWith: ["desktop", "mobile"],
    colorScheme: ["dark"],
    css: async () =>
      (
        await import(
          "@/data/consts/plugins/themes/css-files/complexity/base.css?inline"
        )
      ).default +
      "\n" +
      (
        await import(
          "@/data/consts/plugins/themes/css-files/complexity/shy-moment.css?inline"
        )
      ).default,
  },
  {
    id: "complexity-sour-lemon",
    label: "Sour Lemon",
    description: "Official theme with yellow-ish accent color",
    author: "pnd280",
    isBuiltIn: true,
    compatibleWith: ["desktop", "mobile"],
    colorScheme: ["dark"],
    css: async () =>
      (
        await import(
          "@/data/consts/plugins/themes/css-files/complexity/base.css?inline"
        )
      ).default +
      "\n" +
      (
        await import(
          "@/data/consts/plugins/themes/css-files/complexity/sour-lemon.css?inline"
        )
      ).default,
  },
];

THEME_REGISTRY.forEach((theme) => {
  ThemeSchema.parse(theme);
});
