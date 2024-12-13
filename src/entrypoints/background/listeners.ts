import { onMessage } from "webext-bridge/background";

import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { getThemeCss } from "@/utils/pplx-theme-loader-utils";
import { compareVersions, getOptionsPageUrl } from "@/utils/utils";

export type BackgroundEvents = {
  "bg:getTabId": () => number;
  "bg:removePreloadedTheme": () => void;
};

export function setupBackgroundListeners() {
  chrome.action.onClicked.addListener(async () => {
    const action = (await ExtensionLocalStorageService.get())
      .extensionIconAction;

    if (action === "perplexity")
      chrome.tabs.create({ url: "https://perplexity.ai/" });
    else chrome.runtime.openOptionsPage();
  });

  chrome.runtime.onInstalled.addListener(({ reason, previousVersion }) => {
    if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
      chrome.tabs.create({
        url: `${getOptionsPageUrl()}#/onboarding`,
      });
    } else if (
      reason === chrome.runtime.OnInstalledReason.UPDATE &&
      previousVersion &&
      compareVersions("1.0.0.0", previousVersion) > 0
    ) {
      chrome.tabs.create({
        url: `${getOptionsPageUrl()}#/onboarding?fromAlpha=true`,
      });
    }
  });

  createDashboardShortcut();

  onMessage("bg:getTabId", ({ sender }) => sender.tabId);

  onMessage("bg:removePreloadedTheme", async ({ sender }) => {
    const chosenThemeId = (await ExtensionLocalStorageService.get()).theme;
    const css = await getThemeCss(chosenThemeId);

    if (!css) return;

    chrome.scripting.removeCSS({
      target: { tabId: sender.tabId },
      css,
    });
  });
}

function createDashboardShortcut() {
  chrome.contextMenus.removeAll();

  chrome.contextMenus.create({
    id: "openOptionsPage",
    title: "Dashboard",
    contexts: ["action"],
  });

  chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "openOptionsPage") {
      chrome.tabs.create({ url: getOptionsPageUrl() });
    }
  });
}
