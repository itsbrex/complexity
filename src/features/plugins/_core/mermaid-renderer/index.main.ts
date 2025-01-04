import type { MermaidConfig } from "mermaid";
import pako from "pako";
import svgPanZoom from "svg-pan-zoom";

import { setupMermaidRendererListeners } from "@/features/plugins/_core/mermaid-renderer/listeners.main";
import UiUtils from "@/utils/UiUtils";
import { injectMainWorldScriptBlock } from "@/utils/utils";
import packageJson from "~/package.json";

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
    if (window.mermaid) return;

    if (!this.importPromise) {
      const scriptContent = `
        import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@${packageJson.devDependencies["mermaid"]}/dist/mermaid.esm.min.mjs';
        import * as jsBase64 from 'https://cdn.jsdelivr.net/npm/js-base64@${packageJson.devDependencies["js-base64"]}/+esm';

        window.jsBase64 = jsBase64;
        window.mermaid = mermaid;
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
    return !!window.mermaid;
  }

  async handleRenderRequest(
    selector: string,
  ): Promise<{ success: boolean; error?: string }> {
    const $target = $(selector);

    if ($target.length === 0) {
      console.warn("No elements found for rendering Mermaid canvas");
      return {
        success: false,
        error: "No elements found for rendering Mermaid canvas",
      };
    }

    const isRendered = $target.find("svg").length > 0;

    if (isRendered) {
      return {
        success: true,
      };
    }

    try {
      await this.importMermaid();

      const isDarkTheme = UiUtils.isDarkTheme();

      const config: MermaidConfig = {
        startOnLoad: false,
        theme: isDarkTheme ? "dark" : "base",
        gitGraph: {
          useMaxWidth: true,
        },
        fontFamily: "var(--font-fk-grotesk)",
      };

      window.mermaid!.initialize(config);

      await window.mermaid!.run({
        nodes: [$target[0]],
      });

      const $svg = $target.find("svg");

      $svg.css({
        width: "100%",
        maxWidth: "100%",
        height: "100%",
      });

      const svgPanZoomInstance = svgPanZoom($svg[0], {
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

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: (error as any).str,
      };
    }
  }

  async handleGetPlaygroundUrlRequest(code: string) {
    try {
      await this.importMermaid();

      const json = JSON.stringify({
        code,
      });

      const data = new TextEncoder().encode(json);
      const compressed = pako.deflate(data, { level: 9 });
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
