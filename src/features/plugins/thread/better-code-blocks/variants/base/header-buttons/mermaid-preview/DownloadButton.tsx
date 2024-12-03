import { LuDownload } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { toast } from "@/components/ui/use-toast";
import { useMirroredCodeBlockContext } from "@/features/plugins/thread/better-code-blocks/MirroredCodeBlockContext";
import { DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS } from "@/utils/dom-selectors";

export default function DownloadButton() {
  const { sourceMessageBlockIndex, sourceCodeBlockIndex } =
    useMirroredCodeBlockContext()((state) => ({
      sourceMessageBlockIndex: state.sourceMessageBlockIndex,
      sourceCodeBlockIndex: state.sourceCodeBlockIndex,
    }));

  return (
    <Tooltip
      content={t("plugin-better-code-blocks:headerButtons.mermaid.download")}
    >
      <div
        className="tw-cursor-pointer tw-text-muted-foreground tw-transition-colors hover:tw-text-foreground"
        onClick={() => {
          const selector = `[data-cplx-component="${DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.MESSAGE.BLOCK}"][data-index="${sourceMessageBlockIndex}"] [data-cplx-component="${DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.MIRRORED_CODE_BLOCK}"][data-index="${sourceCodeBlockIndex}"] [data-cplx-component="mermaid-placeholder"] svg`;

          const $svg = $(selector);

          if (!$svg.length) {
            return toast({
              title: t(
                "plugin-better-code-blocks:headerButtons.mermaid.downloadError",
              ),
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
        <LuDownload className="tw-size-4" />
      </div>
    </Tooltip>
  );
}
