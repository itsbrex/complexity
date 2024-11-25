import {
  Theme,
  ThemeSchema,
} from "@/data/consts/plugins/themes/theme-registry.types";

export const THEME_REGISTRY: Record<string, Theme> = {
  complexity: {
    id: "complexity",
    label: "Complexity Blue",
    description: "Official theme with signature blue accent color",
    featuredImage: "https://i.imgur.com/VRrJkQ2.png",
    author: "pnd280",
    isOfficial: true,
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
          "@/data/consts/plugins/themes/css-files/complexity/signature-blue.css?inline"
        )
      ).default,
  },
  complexityPerplexity: {
    id: "complexity-perplexity",
    label: "Perplexity Green",
    description: "Official theme with Perplexity's default accent color",
    featuredImage: "https://i.imgur.com/2l05vPh.png",
    author: "pnd280",
    isOfficial: true,
    compatibleWith: ["desktop", "mobile"],
    colorScheme: ["light", "dark"],
    css: async () =>
      (
        await import(
          "@/data/consts/plugins/themes/css-files/complexity/base.css?inline"
        )
      ).default,
  },
  complexityShyMoment: {
    id: "complexity-shy-moment",
    label: "Shy Moment",
    description: "Official theme with purple-ish accent color",
    featuredImage: "https://i.imgur.com/grA24HD.png",
    author: "pnd280",
    isOfficial: true,
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
};

Object.values(THEME_REGISTRY).forEach((theme) => {
  ThemeSchema.parse(theme);
});
