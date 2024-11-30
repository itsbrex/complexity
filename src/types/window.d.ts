import type { Mermaid } from "mermaid";
import type * as shiki from "shiki";
import type * as svgPanZoom from "svg-pan-zoom";

declare global {
  interface Window {
    next?: {
      appDir: boolean;
      version: string;
      router: {
        back: () => void;
        forward: () => void;
        refresh: () => void;
        replace: (url: string) => void;
        push: (url: string) => void;
        prefetch: (url: string) => void;
      };
    };

    shiki?: typeof shiki;
    mermaid?: Mermaid;
    svgPanZoom?: typeof svgPanZoom;
  }
}

export {};
