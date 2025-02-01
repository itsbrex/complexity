import { produce } from "immer";
import { onMessage } from "webext-bridge/background";

import { APP_CONFIG } from "@/app.config";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";
import { ExtensionLocalStorageApi } from "@/services/extension-local-storage/extension-local-storage-api";
import {
  ExtensionLocalStorage,
  ExtensionLocalStorageSchema,
} from "@/services/extension-local-storage/extension-local-storage.types";
import { hasRequiredPermissions } from "@/services/pplx-theme-preloader";
import { errorWrapper } from "@/utils/error-wrapper";
import { ExtensionVersion } from "@/utils/ext-version";
import { getThemeCss } from "@/utils/pplx-theme-loader-utils";
import { EXT_UPDATE_MIGRATIONS } from "@/utils/update-migrations";
import { getOptionsPageUrl } from "@/utils/utils";

export type BackgroundEvents = {
  "bg:getTabId": () => number;
  "bg:removePreloadedTheme": () => void;
  "bg:openDirectReleaseNotes": ({ version }: { version: string }) => void;
  "bg:openOptionsPage": () => void;
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

  onMessage("bg:openOptionsPage", () => {
    chrome.runtime.openOptionsPage();
  });

  onMessage("bg:removePreloadedTheme", async ({ sender }) => {
    if (!(await hasRequiredPermissions())) return;

    const chosenThemeId = (await ExtensionLocalStorageService.get()).theme;
    const css = await getThemeCss(chosenThemeId);

    if (!css) return;

    console.log("Removing theme", css);
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
            draft.isPostUpdateReleaseNotesPopupDismissed = false;
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

      console.log("Upgraded from", previousVersion, "to", APP_CONFIG.VERSION);

      const migrations = Object.entries(EXT_UPDATE_MIGRATIONS);

      let migratedSettings: ExtensionLocalStorage | null = null;

      for (const [version, migrationFns] of migrations) {
        if (new ExtensionVersion(version).isNewerThan(previousVersion)) {
          for (const migrationFn of migrationFns) {
            const oldRawSettings =
              migratedSettings ?? (await ExtensionLocalStorageApi.get());
            const [newSettings, error] = await errorWrapper(
              (): Promise<ExtensionLocalStorage> =>
                migrationFn({ oldRawSettings }),
            )();

            if (error) continue;

            migratedSettings = newSettings;
          }
        }
      }

      if (migratedSettings) {
        ExtensionLocalStorageApi.set(
          ExtensionLocalStorageSchema.parse(migratedSettings),
        );
      }
    },
  );
}
