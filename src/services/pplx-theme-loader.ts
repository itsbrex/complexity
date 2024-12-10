import { MatchPattern } from "@webext-core/match-patterns";
import { defineProxyService } from "@webext-core/proxy-service";
import debounce from "lodash/debounce";

import { APP_CONFIG } from "@/app.config";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { getThemeCss } from "@/utils/pplx-theme-loader-utils";

class PplxThemeLoaderService {
  private static instance: PplxThemeLoaderService;
  private injectedTabs = new Set<number>();

  private perplexityAiMatchPattern = new MatchPattern(
    APP_CONFIG["perplexity-ai"].globalMatches[0]!,
  );

  private themeConfig = {
    chosenThemeId: "",
    css: "",
  };

  private constructor() {
    this.updateThemeConfigOptimistically();
    this.setupInjectionListener();
  }

  public static getInstance(): PplxThemeLoaderService {
    if (PplxThemeLoaderService.instance == null) {
      PplxThemeLoaderService.instance = new PplxThemeLoaderService();
    }
    return PplxThemeLoaderService.instance;
  }

  private setupInjectionListener() {
    chrome.tabs.onUpdated.removeListener(this.applyTheme);
    chrome.tabs.onUpdated.addListener(this.applyTheme);
  }

  async updateThemeConfigOptimistically() {
    const chosenThemeId = (await ExtensionLocalStorageService.get()).theme;

    this.updateThemeConfig({
      chosenThemeId,
      css: await getThemeCss(chosenThemeId),
    });
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

  private applyTheme = debounce(
    async (tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
      if (changeInfo.status === "complete") return;

      const tab = await chrome.tabs.get(tabId);
      if (!tab.url) return;

      if (this.isFreshPageLoad(changeInfo)) {
        this.injectedTabs.delete(tabId);
      }

      if (
        this.injectedTabs.has(tabId) ||
        !this.perplexityAiMatchPattern.includes(tab.url)
      )
        return;

      await this.injectThemeStyles(tabId);
    },
    500,
    { leading: true },
  );

  private isFreshPageLoad(changeInfo: chrome.tabs.TabChangeInfo): boolean {
    return changeInfo.status === "loading" && changeInfo.url == null;
  }

  private async injectThemeStyles(tabId: number): Promise<void> {
    if (!(await chrome.permissions.contains({ permissions: ["scripting"] }))) {
      return;
    }

    this.injectedTabs.add(tabId);

    try {
      await chrome.scripting.removeCSS({
        target: { tabId },
        css: this.themeConfig.css,
      });

      await chrome.scripting.insertCSS({
        target: { tabId },
        css: this.themeConfig.css,
      });
    } catch (error) {
      console.error("Failed to apply theme:", error);
    }
  }
}

export const [registerPplxThemeLoaderService, getPplxThemeLoaderService] =
  defineProxyService("PplxThemeLoaderService", () =>
    PplxThemeLoaderService.getInstance(),
  );
