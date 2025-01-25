import { LuDownload } from "react-icons/lu";
import { sendMessage } from "webext-bridge/content-script";

import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import {
  formatCanvasTitle,
  getCanvasTitle,
} from "@/plugins/canvas/canvas.types";
import { useCanvasStore } from "@/plugins/canvas/store";
import {
  getMirroredCodeBlockByLocation,
  useMirroredCodeBlocksStore,
} from "@/plugins/thread-better-code-blocks/store";

export default function DownloadAsInteractiveHtml() {
  const { selectedCodeBlockLocation } = useCanvasStore();
  const mirroredCodeBlocks = useMirroredCodeBlocksStore().blocks;
  const selectedCodeBlock = getMirroredCodeBlockByLocation({
    mirroredCodeBlocks,
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });

  if (!selectedCodeBlock) return null;

  return (
    <Tooltip
      content={t("plugin-canvas:canvas.tooltip.downloadAsInteractiveHtml")}
    >
      <Button
        variant="ghost"
        size="iconSm"
        onClick={async () => {
          if (!selectedCodeBlock.codeString || !selectedCodeBlock.language)
            return;

          const title =
            formatCanvasTitle(getCanvasTitle(selectedCodeBlock.language)) ||
            "mindmap";

          await sendMessage(
            "markmapRenderer:downloadAsInteractiveHtml",
            {
              content: selectedCodeBlock.codeString,
              title,
            },
            "window",
          );
        }}
      >
        <LuDownload className="x-size-4" />
      </Button>
    </Tooltip>
  );
}
