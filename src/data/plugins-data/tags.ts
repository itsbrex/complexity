export type PluginTagValues = keyof typeof PLUGIN_TAGS;

export const PLUGIN_TAGS = {
  ui: {
    label: "Appearance",
    description: "UI related plugins",
  },
  ux: {
    label: "Ease of Use",
    description: "UX related plugins",
  },
  desktopOnly: {
    label: "Desktop Only",
    description: "Can only be used on desktop/screen width > 768px",
  },
  slashCommand: {
    label: "Slash Command",
    description: "Plugins that are enabled by typing a slash command",
  },
  privacy: {
    label: "Privacy",
    description: "Privacy related plugins",
  },
  pplxPro: {
    label: "Perplexity Pro",
    description: "Requires an active Perplexity Pro subscription",
  },
  experimental: {
    label: "Experimental",
    description:
      "Experimental plugins. Subject to change or removal without prior notice",
  },
  beta: {
    label: "Beta",
    description: "Official plugins but still in testing/development",
  },
  forFun: {
    label: "For Fun",
    description: "Just for fun!",
  },
  new: {
    label: "New",
    description: "Recently added plugins",
  },
} as const;
