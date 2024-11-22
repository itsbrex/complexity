import type { BundledTheme } from "shiki";

import { LANGUAGE_CODES } from "@/data/consts/plugins/code-highlighter/code-themes";
import { setupCodeHighlighterListeners } from "@/features/plugins/_core/code-highlighter/listeners.main";
import { injectMainWorldScriptBlock, sleep } from "@/utils/utils";

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
    $(() => this.importShiki());
  }

  private async importShiki(): Promise<void> {
    if (window.shiki) return;

    if (!this.importPromise) {
      const scriptContent = `
        import * as shiki from 'https://esm.sh/shiki@1.23.1';
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
    lang: string;
    theme: BundledTheme;
  }): Promise<string | null> {
    const { codeString, lang, theme } = params;

    if (!codeString) {
      throw new Error("Received empty code for highlighting");
    }

    try {
      await this.importShiki();

      if (
        !(lang in window.shiki!.bundledLanguages) &&
        !(lang in LANGUAGE_CODES)
      )
        return null;

      return await window.shiki!.codeToHtml(codeString, {
        lang: lang in LANGUAGE_CODES ? LANGUAGE_CODES[lang] : lang,
        theme,
      });
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
