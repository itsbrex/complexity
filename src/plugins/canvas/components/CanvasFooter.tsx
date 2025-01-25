import CopyButton from "@/components/CopyButton";
import { Button } from "@/components/ui/button";
import {
  getInterpretedCanvasLanguage,
  CanvasLanguage,
} from "@/plugins/canvas/canvas.types";
import { CANVAS_LANGUAGE_ACTION_BUTTONS } from "@/plugins/canvas/canvases";
import AutonomousCanvasVersionsNavigator from "@/plugins/canvas/components/VersionsNavigator";
import { useCanvasStore } from "@/plugins/canvas/store";
import {
  getMirroredCodeBlockByLocation,
  useMirroredCodeBlocksStore,
} from "@/plugins/thread-better-code-blocks/store";

export default function CanvasFooter() {
  const selectedCodeBlockLocation = useCanvasStore(
    (state) => state.selectedCodeBlockLocation,
  );
  const mirroredCodeBlocks = useMirroredCodeBlocksStore(
    (state) => state.blocks,
  );
  const selectedCodeBlock = getMirroredCodeBlockByLocation({
    mirroredCodeBlocks,
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });
  const language = getInterpretedCanvasLanguage(
    selectedCodeBlock?.language ?? "text",
  ) as CanvasLanguage;
  const codeString = selectedCodeBlock?.codeString;

  return (
    <div className="x-flex x-w-full x-items-center x-justify-between x-border-t x-border-border/50 x-bg-background x-p-2 x-px-4">
      <AutonomousCanvasVersionsNavigator />
      <div className="x-ml-auto x-flex x-items-center x-gap-1">
        {CANVAS_LANGUAGE_ACTION_BUTTONS[language] &&
          (() => {
            const ActionButtons = CANVAS_LANGUAGE_ACTION_BUTTONS[language];
            return <ActionButtons />;
          })()}
        <Button
          asChild
          className="x-group x-animate-in x-fade-in"
          variant="ghost"
          size="iconSm"
        >
          <CopyButton
            content={codeString ?? ""}
            className="group-hover:x-text-primary"
          />
        </Button>
      </div>
    </div>
  );
}
