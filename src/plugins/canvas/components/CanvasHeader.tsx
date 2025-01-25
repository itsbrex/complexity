import { LuList, LuRefreshCcw, LuX } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import {
  CanvasLanguage,
  formatCanvasTitle,
  getCanvasTitle,
  getInterpretedCanvasLanguage,
  isAutonomousCanvasLanguageString,
  isCanvasLanguageString,
} from "@/plugins/canvas/canvas.types";
import PreviewToggle from "@/plugins/canvas/components/PreviewToggle";
import { canvasStore, useCanvasStore } from "@/plugins/canvas/store";
import {
  useMirroredCodeBlocksStore,
  getMirroredCodeBlockByLocation,
} from "@/plugins/thread-better-code-blocks/store";
import { DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS } from "@/utils/dom-selectors";
import { scrollToElement } from "@/utils/utils";

export default function CanvasHeader() {
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
  const title = formatCanvasTitle(getCanvasTitle(selectedCodeBlock?.language));
  const isCanvasLanguage = isCanvasLanguageString(selectedCodeBlock?.language);
  const isAutonomousCanvasLanguage = isAutonomousCanvasLanguageString(
    selectedCodeBlock?.language,
  );
  const isInFlight = selectedCodeBlock?.isInFlight;
  const canvasViewMode = useCanvasStore((state) => state.state);
  const language = getInterpretedCanvasLanguage(
    selectedCodeBlock?.language ?? "text",
  ) as CanvasLanguage;

  if (!isCanvasLanguage && !isAutonomousCanvasLanguage) return null;

  return (
    <div className="x-flex x-w-full x-items-center x-justify-between x-border-b x-border-border/50 x-bg-background x-p-2 x-px-4">
      <div
        className="x-line-clamp-1 x-cursor-pointer x-text-muted-foreground"
        onClick={() => {
          const selectedCodeBlockLocation =
            canvasStore.getState().selectedCodeBlockLocation;
          if (!selectedCodeBlockLocation) return;

          const selector = `[data-cplx-component="${DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.MESSAGE.BLOCK}"][data-index="${selectedCodeBlockLocation.messageBlockIndex}"] [data-cplx-component="${DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.MIRRORED_CODE_BLOCK}"][data-index="${selectedCodeBlockLocation.codeBlockIndex}"]`;

          scrollToElement($(selector), -100);
        }}
      >
        {title}
      </div>
      <div className="x-flex x-items-center x-gap-1">
        <div
          className={cn("x-flex x-items-center x-gap-1", {
            "x-invisible": isInFlight,
          })}
        >
          {canvasViewMode === "preview" && (
            <Tooltip content={t("plugin-canvas:canvas.tooltip.refresh")}>
              <Button
                variant="ghost"
                size="iconSm"
                className="x-animate-in x-fade-in"
                onClick={() => canvasStore.getState().refreshPreview()}
              >
                <LuRefreshCcw className="x-size-4" />
              </Button>
            </Tooltip>
          )}
          {isAutonomousCanvasLanguage && (
            <>
              <PreviewToggle language={language} />
              {isAutonomousCanvasLanguage && (
                <Tooltip content={t("plugin-canvas:canvas.tooltip.openList")}>
                  <Button
                    variant="ghost"
                    size="iconSm"
                    onClick={() => canvasStore.getState().openCanvasList()}
                  >
                    <LuList className="x-size-4" />
                  </Button>
                </Tooltip>
              )}
            </>
          )}
        </div>
        <Button
          variant="ghost"
          size="iconSm"
          onClick={() => canvasStore.getState().close()}
        >
          <LuX className="x-size-4" />
        </Button>
      </div>
    </div>
  );
}
