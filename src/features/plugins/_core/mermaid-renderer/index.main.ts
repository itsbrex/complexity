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

      const config: MermaidConfig = {
        startOnLoad: false,
        theme: isDarkTheme ? "dark" : "base",
        gitGraph: {
          useMaxWidth: true,
        },
        fontFamily: "var(--font-fk-grotesk)",
      };

      const scriptContent = `
        import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
        import 'https://cdn.jsdelivr.net/npm/svg-pan-zoom@3.6.2/dist/svg-pan-zoom.min.js';
        import * as jsBase64 from 'https://cdn.jsdelivr.net/npm/js-base64@3.7.7/+esm';
        import pako from 'https://cdn.jsdelivr.net/npm/pako@2.1.0/+esm';

        window.pako = pako;
        window.jsBase64 = jsBase64;
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

    const isRendered = $target.find("svg").length > 0;

    if (isRendered) return true;

    try {
      await this.importMermaid();

      await window.mermaid!.run({
        nodes: [$target[0]],
      });

      const $svg = $target.find("svg");

      $svg.css({
        width: "100%",
        maxWidth: "100%",
        height: "100%",
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

  async handleGetPlaygroundUrlRequest(code: string) {
    try {
      await this.importMermaid();

      const json = JSON.stringify({
        code,
      });

      const data = new TextEncoder().encode(json);
      const compressed = window.pako!.deflate(data, { level: 9 });
      const encoded = window.jsBase64!.fromUint8Array(compressed, true);

      return `https://mermaidchart.com/play#pako:${encoded}`;
    } catch (e) {
      console.error("[MermaidRenderer] Error getting playground URL:", e);
      return "";
    }
  }

  static async waitForInitialization() {
    while (!this.isInitialized()) {
      await sleep(100);
    }
  }
}

MermaidRenderer.getInstance().initialize();
