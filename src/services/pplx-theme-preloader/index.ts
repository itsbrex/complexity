import { MatchPattern } from "@webext-core/match-patterns";
import { defineProxyService } from "@webext-core/proxy-service";

import { APP_CONFIG } from "@/app.config";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";
import { ExtensionLocalStorageApi } from "@/services/extension-local-storage/extension-local-storage-api";
import { getThemeCss } from "@/utils/pplx-theme-loader-utils";
import { isInContentScript } from "@/utils/utils";

const PERPLEXITY_MATCH_PATTERNS = [
  new MatchPattern(APP_CONFIG["perplexity-ai"].globalMatches[0]!),
  new MatchPattern(APP_CONFIG["perplexity-ai"].globalMatches[1]!),
] as const;

export const hasRequiredPermissions = async () => {
  const hasPermissions = await chrome.permissions.contains({
    permissions: ["scripting", "webNavigation"],
  });

  const isEnabled = (await ExtensionLocalStorageService.get()).preloadTheme;

  const isChrome = APP_CONFIG.BROWSER === "chrome";

  return hasPermissions && isEnabled && isChrome;
};

const isValidPerplexityUrl = (url: string) => {
  return PERPLEXITY_MATCH_PATTERNS.some((pattern) => pattern.includes(url));
};

type ThemeConfig = {
  chosenThemeId: string;
  css: string;
};

// This service only breifly injects the theme to prevent FOUC (and then immediately removes it), the css should be injected by the content script
class PplxThemePreloaderService {
  private static instance: PplxThemePreloaderService;
  private themeConfig: ThemeConfig = {
    chosenThemeId: "",
    css: "",
  };
  private isListenerActive = false;

  private constructor() {
    this.setupListeners();
  }

  async setupListeners() {
    const chosenThemeId = (await ExtensionLocalStorageService.get()).theme;

    this.updateThemeConfig({
      chosenThemeId,
      css: await getThemeCss(chosenThemeId),
    });

    this.initPermissionsEventListener();
    await this.tryActivateNavigationListener();
  }

  private async tryActivateNavigationListener() {
    const hasPermissions = await hasRequiredPermissions();

    if (hasPermissions && !this.isListenerActive) {
      this.activateNavigationListener();
    } else if (!hasPermissions && this.isListenerActive) {
      this.deactivateNavigationListener();
    }
  }

  private initPermissionsEventListener() {
    ExtensionLocalStorageApi.listen((changes) => {
      if (changes.preloadTheme == null) return;
      this.tryActivateNavigationListener();
    });

    chrome.permissions.onAdded.addListener(() => {
      this.tryActivateNavigationListener();
    });

    chrome.permissions.onRemoved.addListener(() => {
      this.tryActivateNavigationListener();
    });
  }

  private activateNavigationListener() {
    this.deactivateNavigationListener();

    chrome.webNavigation.onCommitted.addListener(this.preloadTheme, {
      url: [{ hostContains: "perplexity.ai" }],
    });

    this.isListenerActive = true;
  }

  private deactivateNavigationListener() {
    chrome.webNavigation.onCommitted.removeListener(this.preloadTheme);
    this.isListenerActive = false;
  }

  private preloadTheme = async (
    details: chrome.webNavigation.WebNavigationFramedCallbackDetails,
  ) => {
    if (!(await hasRequiredPermissions())) return;

    if (details.frameId !== 0 || !isValidPerplexityUrl(details.url)) return;

    try {
      await chrome.scripting.insertCSS({
        target: { tabId: details.tabId },
        css: this.themeConfig.css,
      });
    } catch (error) {
      console.error("Failed to apply theme:", error);
    }
  };

  public static getInstance(): PplxThemePreloaderService {
    if (PplxThemePreloaderService.instance == null) {
      PplxThemePreloaderService.instance = new PplxThemePreloaderService();
    }
    return PplxThemePreloaderService.instance;
  }

  async updateThemeConfig(config: ThemeConfig) {
    this.themeConfig = config;
  }
}

export const [registerPplxThemePreloaderService, getPplxThemePreloaderService] =
  defineProxyService("PplxThemePreloaderService", () =>
    PplxThemePreloaderService.getInstance(),
  );

export function getNonProxiedPplxThemePreloaderService() {
  if (isInContentScript())
    throw new Error(
      "Not allowed in content script. Call getPplxThemePreloaderService() instead.",
    );

  return PplxThemePreloaderService.getInstance();
}
