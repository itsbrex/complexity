import { produce } from "immer";
import { onMessage } from "webext-bridge/background";

import { APP_CONFIG } from "@/app.config";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { ExtensionLocalStorageApi } from "@/services/extension-local-storage/extension-local-storage-api";
import { ExtensionLocalStorage } from "@/services/extension-local-storage/extension-local-storage.types";
import { ExtensionVersion } from "@/utils/ext-version";
import { getThemeCss } from "@/utils/pplx-theme-loader-utils";
import { EXT_UPDATE_MIGRATIONS } from "@/utils/update-migrations";
import { getOptionsPageUrl } from "@/utils/utils";

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
      new ExtensionVersion("1.0.0.0").isNewerThan(previousVersion)
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
  chrome.runtime.onInstalled.addListener(
    async ({ reason, previousVersion }) => {
      if (reason !== chrome.runtime.OnInstalledReason.UPDATE) return;

      const oldRawSettings = await ExtensionLocalStorageApi.get();

      ExtensionLocalStorageApi.set(
        produce(oldRawSettings, (draft) => {
          draft.cdnLastUpdated = Date.now();
        }),
      );

      if (
        previousVersion &&
        new ExtensionVersion(APP_CONFIG.VERSION).isNewerThan(previousVersion)
      ) {
        ExtensionLocalStorageApi.set(
          produce(oldRawSettings, (draft) => {
            draft.showPostUpdateReleaseNotesPopup = true;
          }),
        );
      }
    },
  );
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

      if (!previousVersion) return;

      const migrations = Object.entries(EXT_UPDATE_MIGRATIONS);

      let finalSettings: ExtensionLocalStorage | null = null;

      for (const [version, migrationFn] of migrations) {
        if (new ExtensionVersion(version).isNewerThan(previousVersion)) {
          const oldRawSettings =
            finalSettings ?? (await ExtensionLocalStorageApi.get());

          const newSettings = await migrationFn({
            oldRawSettings,
          });

          finalSettings = newSettings;
        }
      }

      if (finalSettings) {
        ExtensionLocalStorageApi.set(finalSettings);
      }
    },
  );
}
