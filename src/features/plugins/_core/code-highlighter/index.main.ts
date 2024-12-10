import type { BundledTheme } from "shiki";

import { TRANSFORMER } from "@/data/plugins/code-highlighter/code-themes";
import {
  INTERPRETED_LANGUAGE_CODE,
  isInterpretedLanguageCode,
} from "@/data/plugins/code-highlighter/language-codes";
import dualThemesCss from "@/features/plugins/_core/code-highlighter/dual-themes.css?inline";
import { setupCodeHighlighterListeners } from "@/features/plugins/_core/code-highlighter/listeners.main";
import { injectMainWorldScriptBlock, insertCss } from "@/utils/utils";
import packageJson from "~/package.json";

export class CodeHighlighter {
  private static instance: CodeHighlighter | null = null;
  private importPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): CodeHighlighter {
    if (!CodeHighlighter.instance) {
      CodeHighlighter.instance = new CodeHighlighter();
    }
    return CodeHighlighter.instance;
  }

  async initialize(): Promise<void> {
    setupCodeHighlighterListeners();
    $(() => {
      this.importShiki();
      insertCss({
        id: "cplx-code-highlighter-dual-themes",
        css: dualThemesCss,
      });
    });
  }

  private async importShiki(): Promise<void> {
    if (window.shiki) return;

    if (!this.importPromise) {
      const scriptContent = `
        import * as shiki from 'https://esm.sh/shiki@${packageJson.devDependencies["shiki"]}';
        window.shiki = shiki;
      `;

      this.importPromise = injectMainWorldScriptBlock({
        scriptContent,
        waitForExecution: true,
      }).catch((error) => {
        console.error("Failed to import Shiki:", error);
        throw error;
      });
    }

    return this.importPromise;
  }

  static isInitialized(): boolean {
    return !!window.shiki;
  }

  async handleHighlightRequest(params: {
    codeString: string;
    language: string;
    themes: {
      light: BundledTheme;
      dark: BundledTheme;
    };
  }): Promise<string | null> {
    const { codeString, language, themes } = params;

    if (!codeString) {
      throw new Error("Received empty code for highlighting");
    }

    try {
      await this.importShiki();

      if (
        !(language in window.shiki!.bundledLanguages) &&
        !(language in INTERPRETED_LANGUAGE_CODE)
      )
        return null;

      const preprocessedCodeString =
        TRANSFORMER[language]?.pre?.(codeString) ?? codeString;

      const langKey = isInterpretedLanguageCode(language)
        ? INTERPRETED_LANGUAGE_CODE[language]
        : language;

      const html = await window.shiki!.codeToHtml(preprocessedCodeString, {
        lang: langKey,
        themes,
      });

      const postprocessedHtml = TRANSFORMER[language]?.post?.(html) ?? html;

      return postprocessedHtml;
    } catch (error) {
      console.error("Error highlighting code:", error);
      return null;
    }
  }

  static async waitForInitialization(): Promise<void> {
    while (!this.isInitialized()) {
      await sleep(100);
    }
  }
}

CodeHighlighter.getInstance().initialize();
