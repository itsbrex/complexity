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
    description: t("dashboard-settings-page:permissions.cookies.description"),
  },
};
