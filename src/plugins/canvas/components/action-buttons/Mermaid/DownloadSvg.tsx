import { LuDownload } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export default function MermaidDownloadSvg() {
  return (
    <Tooltip content={t("plugin-canvas:canvas.tooltip.downloadSvg")}>
      <Button
        variant="ghost"
        size="iconSm"
        onClick={() => {
          const selector = `div[id^="canvas-mermaid-container"][data-processed="true"] svg`;

          const $svg = $(selector);

          if (!$svg.length) {
            return toast({
              title: t("plugin-canvas:canvas.error.noSvg"),
            });
          }

          const svgContent = $svg[0].outerHTML;
          const blob = new Blob([svgContent], { type: "image/svg+xml" });
          const url = URL.createObjectURL(blob);

          const a = document.createElement("a");
          a.href = url;
          a.download = "diagram.svg";
          a.click();

          setTimeout(() => URL.revokeObjectURL(url), 100);
        }}
      >
        <LuDownload className="x-size-4" />
      </Button>
    </Tooltip>
  );
}
