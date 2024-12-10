export const TOGGLEABLE_PERMISSIONS: chrome.runtime.ManifestPermissions[] = [
  // "cookies",
  "scripting",
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
  scripting: {
    title: "Scripting",
    description:
      "Allow the extension to inject custom themes onto Perplexity.ai pages at instant speed.",
  },
};
