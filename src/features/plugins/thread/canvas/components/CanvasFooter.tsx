import CopyButton from "@/components/CopyButton";
import { Button } from "@/components/ui/button";
import {
  getMirroredCodeBlockByLocation,
  useMirroredCodeBlocksStore,
} from "@/features/plugins/thread/better-code-blocks/store";
import {
  getInterpretedCanvasLanguage,
  CanvasLanguage,
} from "@/features/plugins/thread/canvas/canvas.types";
import { CANVAS_LANGUAGE_ACTION_BUTTONS } from "@/features/plugins/thread/canvas/canvases";
import AutonomousCanvasVersionsNavigator from "@/features/plugins/thread/canvas/components/VersionsNavigator";
import { useCanvasStore } from "@/features/plugins/thread/canvas/store";

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
    <div className="tw-flex tw-w-full tw-items-center tw-justify-between tw-border-t tw-border-border/50 tw-bg-background tw-p-2 tw-px-4">
      <AutonomousCanvasVersionsNavigator />
      <div className="tw-ml-auto tw-flex tw-items-center tw-gap-1">
        {CANVAS_LANGUAGE_ACTION_BUTTONS[language] &&
          (() => {
            const ActionButtons = CANVAS_LANGUAGE_ACTION_BUTTONS[language];
            return <ActionButtons />;
          })()}
        <Button
          asChild
          className="tw-group tw-animate-in tw-fade-in"
          variant="ghost"
          size="icon"
        >
          <CopyButton
            content={codeString ?? ""}
            className="group-hover:tw-text-primary"
          />
        </Button>
      </div>
    </div>
  );
}
