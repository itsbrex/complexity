import { onMessage } from "webext-bridge/window";

import { MermaidRenderer } from "@/features/plugins/_core/mermaid-renderer/index.main";

export type MermaidRendererEvents = {
  "mermaidRenderer:isInitialized": () => boolean;
  "mermaidRenderer:render": (params: { selector: string }) => boolean;
};

export function setupMermaidRendererListeners() {
  onMessage("mermaidRenderer:isInitialized", () =>
    MermaidRenderer.isInitialized(),
  );

  onMessage("mermaidRenderer:render", ({ data: { selector } }) => {
    return MermaidRenderer.getInstance().handleRenderRequest(selector);
  });
}
