import type { BundledTheme } from "shiki";
import { onMessage } from "webext-bridge/window";

import { CodeHighlighter } from "@/features/plugins/_core/code-highlighter/index.main";

export type CodeHighlighterEvents = {
  "codeHighlighter:isInitialized": () => boolean;
  "codeHighlighter:getHighlightedCodeAsHtml": (params: {
    codeString: string;
    language: string;
    themes: {
      light: BundledTheme;
      dark: BundledTheme;
    };
  }) => string | null;
};

export function setupCodeHighlighterListeners() {
  onMessage("codeHighlighter:isInitialized", () =>
    CodeHighlighter.isInitialized(),
  );

  onMessage(
    "codeHighlighter:getHighlightedCodeAsHtml",
    async ({ data: params }) => {
      await CodeHighlighter.waitForInitialization();

      return await CodeHighlighter.getInstance().handleHighlightRequest(params);
    },
  );
}
