export const TOGGLEABLE_PERMISSIONS: chrome.runtime.ManifestPermissions[] = [
  // "cookies",
  "scripting",
  "webNavigation",
];

export const TOGGLEABLE_PERMISSIONS_DETAILS: Partial<
  Record<
    chrome.runtime.ManifestPermissions,
    {
      title: string;
      description: string;
    }
  >
> = {
  cookies: {
    title: "Cookies",
    description:
      "Allow the extension to sync settings with your Perplexity.ai preferences. Also used to identify your Supporter status",
  },
  scripting: {
    title: "Scripting",
    description:
      "Allow the extension to execute code and apply styles into webpages",
  },
  webNavigation: {
    title: "Web Navigation",
    description:
      "Allow the extension to watch for navigation events (for perplexity.ai domains only). We DO NOT use this permission to read your browsing history.",
  },
};
