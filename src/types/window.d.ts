import * as jsBase64 from "js-base64";
import type { Mermaid } from "mermaid";
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

    mermaid?: Mermaid;
    svgPanZoom?: typeof svgPanZoom;
    jsBase64?: typeof jsBase64;
  }
}

export {};
