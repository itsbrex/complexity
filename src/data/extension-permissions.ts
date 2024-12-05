export const TOGGLEABLE_PERMISSIONS: chrome.runtime.ManifestPermissions[] = [
  // "cookies",
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
      "Allow the extension to sync settings with your Perplexity.ai preferences. Also used to identify your Supporter status.",
  },
};
