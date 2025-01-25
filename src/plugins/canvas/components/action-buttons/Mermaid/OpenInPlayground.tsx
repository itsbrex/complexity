import { LuExternalLink } from "react-icons/lu";
import { sendMessage } from "webext-bridge/content-script";

import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useCanvasStore } from "@/plugins/canvas/store";
import {
  getMirroredCodeBlockByLocation,
  useMirroredCodeBlocksStore,
} from "@/plugins/thread-better-code-blocks/store";

export default function MermaidOpenInPlayground() {
  const { selectedCodeBlockLocation } = useCanvasStore();
  const mirroredCodeBlocks = useMirroredCodeBlocksStore().blocks;
  const selectedCodeBlock = getMirroredCodeBlockByLocation({
    mirroredCodeBlocks,
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });

  if (!selectedCodeBlock) return null;

  return (
    <Tooltip content={t("plugin-canvas:canvas.tooltip.openInMermaid")}>
      <Button
        variant="ghost"
        size="iconSm"
        onClick={async () => {
          if (!selectedCodeBlock.codeString) return;

          const url = await sendMessage(
            "mermaidRenderer:getPlaygroundUrl",
            {
              code: selectedCodeBlock.codeString,
            },
            "window",
          );

          if (!url) {
            return toast({
              title: t("plugin-canvas:canvas.error.previewUrl"),
            });
          }

          window.open(url, "_blank");
        }}
      >
        <LuExternalLink className="x-size-4" />
      </Button>
    </Tooltip>
  );
}
