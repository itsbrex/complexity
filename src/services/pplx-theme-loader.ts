import { MatchPattern } from "@webext-core/match-patterns";
import { defineProxyService } from "@webext-core/proxy-service";

import { APP_CONFIG } from "@/app.config";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { getThemeCss } from "@/utils/pplx-theme-loader-utils";

const PERPLEXITY_MATCH_PATTERNS = [
  new MatchPattern(APP_CONFIG["perplexity-ai"].globalMatches[0]!),
  new MatchPattern(APP_CONFIG["perplexity-ai"].globalMatches[1]!),
] as const;

const hasRequiredPermissions = async () => {
  return chrome.permissions.contains({
    permissions: ["scripting", "webNavigation"],
  });
};

const isValidPerplexityUrl = (url: string) => {
  return PERPLEXITY_MATCH_PATTERNS.some((pattern) => pattern.includes(url));
};

type ThemeConfig = {
  chosenThemeId: string;
  css: string;
};

class PplxThemeLoaderService {
  private static instance: PplxThemeLoaderService;
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
    chrome.permissions.onAdded.addListener(() => {
      this.tryActivateNavigationListener();
    });

    chrome.permissions.onRemoved.addListener(() => {
      this.tryActivateNavigationListener();
    });
  }

  private activateNavigationListener() {
    this.deactivateNavigationListener();

    chrome.webNavigation.onCommitted.addListener(this.handleNavigation, {
      url: [{ hostContains: "perplexity.ai" }],
    });

    this.isListenerActive = true;
  }

  private deactivateNavigationListener() {
    chrome.webNavigation.onCommitted.removeListener(this.handleNavigation);
    this.isListenerActive = false;
  }

  private handleNavigation = async (
    details: chrome.webNavigation.WebNavigationFramedCallbackDetails,
  ) => {
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

  public static getInstance(): PplxThemeLoaderService {
    if (PplxThemeLoaderService.instance == null) {
      PplxThemeLoaderService.instance = new PplxThemeLoaderService();
    }
    return PplxThemeLoaderService.instance;
  }

  async updateThemeConfig(config: ThemeConfig) {
    this.themeConfig = config;
  }
}

export const [registerPplxThemeLoaderService, getPplxThemeLoaderService] =
  defineProxyService("PplxThemeLoaderService", () =>
    PplxThemeLoaderService.getInstance(),
  );
