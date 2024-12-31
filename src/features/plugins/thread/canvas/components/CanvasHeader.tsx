import { LuList, LuRefreshCcw, LuX } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import {
  useMirroredCodeBlocksStore,
  getMirroredCodeBlockByLocation,
} from "@/features/plugins/thread/better-code-blocks/store";
import {
  CanvasLanguage,
  formatCanvasTitle,
  getCanvasTitle,
  getInterpretedCanvasLanguage,
  isAutonomousCanvasLanguageString,
  isCanvasLanguageString,
} from "@/features/plugins/thread/canvas/canvas.types";
import PreviewToggle from "@/features/plugins/thread/canvas/components/PreviewToggle";
import {
  canvasStore,
  useCanvasStore,
} from "@/features/plugins/thread/canvas/store";
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
    <div className="tw-flex tw-w-full tw-items-center tw-justify-between tw-border-b tw-border-border/50 tw-bg-background tw-p-2 tw-px-4">
      <div
        className="tw-line-clamp-1 tw-cursor-pointer tw-text-muted-foreground"
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
      <div className="tw-flex tw-items-center tw-gap-1">
        <div
          className={cn("tw-flex tw-items-center tw-gap-1", {
            "tw-invisible": isInFlight,
          })}
        >
          {canvasViewMode === "preview" && (
            <Tooltip content={t("plugin-canvas:canvas.tooltip.refresh")}>
              <Button
                variant="ghost"
                size="icon"
                className="tw-animate-in tw-fade-in"
                onClick={() => canvasStore.getState().refreshPreview()}
              >
                <LuRefreshCcw className="tw-size-4" />
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
                    size="icon"
                    onClick={() => canvasStore.getState().openCanvasList()}
                  >
                    <LuList className="tw-size-4" />
                  </Button>
                </Tooltip>
              )}
            </>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => canvasStore.getState().close()}
        >
          <LuX className="tw-size-4" />
        </Button>
      </div>
    </div>
  );
}
