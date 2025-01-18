import { onMessage } from "webext-bridge/background";

import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { ExtensionLocalStorageApi } from "@/services/extension-local-storage/extension-local-storage-api";
import { getThemeCss } from "@/utils/pplx-theme-loader-utils";
import { EXT_UPDATE_MIGRATIONS } from "@/utils/update-migrations";
import { compareVersions, getOptionsPageUrl } from "@/utils/utils";

export type BackgroundEvents = {
  "bg:getTabId": () => number;
  "bg:removePreloadedTheme": () => void;
  "bg:openDirectReleaseNotes": ({ version }: { version: string }) => void;
};

export function setupBackgroundListeners() {
  extensionIconActionListener();

  onboardingFlowTrigger();

  updateMigrations();

  invalidateCdnCache();

  createDashboardShortcut();

  contentScriptListeners();
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

function onboardingFlowTrigger() {
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
}

function contentScriptListeners() {
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

  onMessage("bg:openDirectReleaseNotes", ({ data: { version } }) => {
    const optionsPageUrl = getOptionsPageUrl();

    chrome.tabs.create({
      url: `${optionsPageUrl}#/direct-release-notes?version=${version}`,
    });
  });
}

function invalidateCdnCache() {
  chrome.runtime.onInstalled.addListener(({ reason }) => {
    if (reason !== chrome.runtime.OnInstalledReason.UPDATE) return;

    ExtensionLocalStorageService.set((draft) => {
      draft.cdnLastUpdated = Date.now();
    });
  });
}

function extensionIconActionListener() {
  chrome.action.onClicked.addListener(async () => {
    const action = (await ExtensionLocalStorageService.get())
      .extensionIconAction;

    if (action === "perplexity")
      chrome.tabs.create({ url: "https://perplexity.ai/" });
    else chrome.runtime.openOptionsPage();
  });
}

function updateMigrations() {
  chrome.runtime.onInstalled.addListener(
    async ({ reason, previousVersion }) => {
      if (reason !== chrome.runtime.OnInstalledReason.UPDATE) return;

      if (!previousVersion || !(previousVersion in EXT_UPDATE_MIGRATIONS))
        return;

      const migrationFn =
        EXT_UPDATE_MIGRATIONS[
          previousVersion as keyof typeof EXT_UPDATE_MIGRATIONS
        ];

      if (!migrationFn) return;

      migrationFn({
        oldRawSettings: await ExtensionLocalStorageApi.get(),
        previousVersion,
      });
    },
  );
}
