import type { MermaidConfig } from "mermaid";

import { setupMermaidRendererListeners } from "@/features/plugins/_core/mermaid-renderer/listeners.main";
import UiUtils from "@/utils/UiUtils";
import { injectMainWorldScriptBlock } from "@/utils/utils";

export class MermaidRenderer {
  private static instance: MermaidRenderer | null = null;
  private importPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance() {
    if (!MermaidRenderer.instance) {
      MermaidRenderer.instance = new MermaidRenderer();
    }
    return MermaidRenderer.instance;
  }

  initialize() {
    setupMermaidRendererListeners();
    $(() => this.importMermaid());
  }

  private async importMermaid(): Promise<void> {
    if (window.mermaid && window.svgPanZoom) return;

    if (!this.importPromise) {
      const isDarkTheme = UiUtils.isDarkTheme();

      const background = getComputedStyle(
        document.documentElement,
      ).getPropertyValue("--background");

      const uiFont =
        getComputedStyle(document.body).getPropertyValue("--font-fk-grotesk") ||
        getComputedStyle(document.documentElement).getPropertyValue(
          "--font-berkeley-mono",
        );

      const config: MermaidConfig = {
        startOnLoad: false,
        theme: isDarkTheme ? "dark" : "base",
        themeVariables: {
          edgeLabelBackground: background,
        },
        gitGraph: {
          useMaxWidth: true,
        },
        fontFamily: uiFont,
      };

      const scriptContent = `
        import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
        import 'https://cdn.jsdelivr.net/npm/svg-pan-zoom@3.6.2/dist/svg-pan-zoom.min.js';

        window.mermaid = mermaid;

        window.mermaid.initialize(${JSON.stringify(config)});
      `;

      this.importPromise = injectMainWorldScriptBlock({
        scriptContent,
        waitForExecution: true,
      }).catch((error) => {
        console.error("Failed to import Mermaid:", error);
        throw error;
      });
    }

    return this.importPromise;
  }

  static isInitialized() {
    return !!window.mermaid && !!window.svgPanZoom;
  }

  async handleRenderRequest(selector: string) {
    const $target = $(selector);

    if ($target.length === 0) {
      console.warn("No elements found for rendering Mermaid canvas");
      return false;
    }

    try {
      await this.importMermaid();

      await window.mermaid!.run({
        nodes: [$target[0]],
      });

      const $svg = $target.find("svg");

      $svg.addClass("!tw-size-full").css({
        "max-width": "100%",
      });

      const svgPanZoomInstance = window.svgPanZoom!($svg[0], {
        center: true,
        fit: true,
        contain: true,
        dblClickZoomEnabled: true,
      });

      $target.on("resetZoom", () => {
        svgPanZoomInstance.resetZoom();
      });

      $target.on("resetPan", () => {
        svgPanZoomInstance.resetPan();
      });

      return true;
    } catch (error) {
      console.error("[MermaidRenderer] Error rendering:", error);
      return false;
    }
  }

  static async waitForInitialization() {
    while (!this.isInitialized()) {
      await sleep(100);
    }
  }
}

MermaidRenderer.getInstance().initialize();
