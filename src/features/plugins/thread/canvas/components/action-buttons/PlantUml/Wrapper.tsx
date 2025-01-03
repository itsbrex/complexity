import { LuExternalLink } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import {
  useMirroredCodeBlocksStore,
  getMirroredCodeBlockByLocation,
} from "@/features/plugins/thread/better-code-blocks/store";
import { useCanvasStore } from "@/features/plugins/thread/canvas/store";
import { generatePlantUMLUrl } from "@/utils/plantUml";

export default function PlantUmlCanvasActionButtonsWrapper() {
  const { selectedCodeBlockLocation } = useCanvasStore();
  const mirroredCodeBlocks = useMirroredCodeBlocksStore().blocks;
  const selectedCodeBlock = getMirroredCodeBlockByLocation({
    mirroredCodeBlocks,
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });

  if (!selectedCodeBlock) return null;

  return (
    <Button
      variant="ghost"
      size="iconSm"
      onClick={() => {
        const code = selectedCodeBlock.codeString;
        if (!code) return;
        const url = generatePlantUMLUrl(code);
        if (!url) return;
        window.open(url, "_blank");
      }}
    >
      <LuExternalLink className="tw-size-4" />
    </Button>
  );
}
