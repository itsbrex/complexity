import { MatchPattern } from "@webext-core/match-patterns";
import { defineProxyService } from "@webext-core/proxy-service";

import { APP_CONFIG } from "@/app.config";

class PplxThemeLoaderService {
  private static instance: PplxThemeLoaderService;
  private perplexityAiMatchPatterns = [
    new MatchPattern(APP_CONFIG["perplexity-ai"].globalMatches[0]!),
    new MatchPattern(APP_CONFIG["perplexity-ai"].globalMatches[1]!),
  ];

  private themeConfig = {
    chosenThemeId: "",
    css: "",
  };

  private constructor() {
    this.initPermissionsEventListener();
    setTimeout(async () => {
      const hasPermissions = await this.hasPermissions();

      if (!hasPermissions) return;

      this.initNavigationEventListener();
    });
  }

  private async initPermissionsEventListener() {
    chrome.permissions.onAdded.addListener(async () => {
      const hasPermissions = await this.hasPermissions();

      if (!hasPermissions) return;

      this.initNavigationEventListener();
    });
  }

  private initNavigationEventListener() {
    chrome.webNavigation.onCommitted.removeListener(this.handleNavigation);

    chrome.webNavigation.onCommitted.addListener(this.handleNavigation, {
      url: [
        {
          hostContains: "perplexity.ai",
        },
      ],
    });
  }

  private handleNavigation = async (
    details: chrome.webNavigation.WebNavigationFramedCallbackDetails,
  ) => {
    if (details.frameId !== 0) return;
    if (
      !this.perplexityAiMatchPatterns.some((pattern) =>
        pattern.includes(details.url),
      )
    )
      return;

    try {
      await chrome.scripting.insertCSS({
        target: { tabId: details.tabId },
        css: this.themeConfig.css,
      });
    } catch (error) {
      console.error("Failed to apply theme:", error);
    }
  };

  private async hasPermissions() {
    const hasPermissions = await chrome.permissions.contains({
      permissions: ["scripting", "webNavigation"],
    });

    return hasPermissions;
  }

  public static getInstance(): PplxThemeLoaderService {
    if (PplxThemeLoaderService.instance == null) {
      PplxThemeLoaderService.instance = new PplxThemeLoaderService();
    }
    return PplxThemeLoaderService.instance;
  }

  async updateThemeConfig({
    css,
    chosenThemeId,
  }: {
    css: string;
    chosenThemeId: string;
  }) {
    this.themeConfig = { css, chosenThemeId };
  }
}

export const [registerPplxThemeLoaderService, getPplxThemeLoaderService] =
  defineProxyService("PplxThemeLoaderService", () =>
    PplxThemeLoaderService.getInstance(),
  );
