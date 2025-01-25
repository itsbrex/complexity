import { LuLoaderCircle } from "react-icons/lu";

import {
  CanvasLanguage,
  formatCanvasTitle,
  getCanvasTitle,
  getInterpretedCanvasLanguage,
} from "@/plugins/canvas/canvas.types";
import { CANVAS_PLACEHOLDERS } from "@/plugins/canvas/canvases";
import { canvasStore, useCanvasStore } from "@/plugins/canvas/store";
import { useMirroredCodeBlockContext } from "@/plugins/thread-better-code-blocks/MirroredCodeBlockContext";

const CanvasPlaceholderWrapper = memo(function CanvasPlaceholderWrapper() {
  const {
    language,
    isInFlight,
    sourceMessageBlockIndex,
    sourceCodeBlockIndex,
  } = useMirroredCodeBlockContext()();

  const selectedCodeBlockLocation = useCanvasStore(
    (state) => state.selectedCodeBlockLocation,
  );

  const isSelected =
    selectedCodeBlockLocation?.messageBlockIndex === sourceMessageBlockIndex &&
    selectedCodeBlockLocation?.codeBlockIndex === sourceCodeBlockIndex;

  const title = formatCanvasTitle(getCanvasTitle(language));
  const interpretedLanguage = getInterpretedCanvasLanguage(language);

  const placeholderElements =
    CANVAS_PLACEHOLDERS[interpretedLanguage as CanvasLanguage];

  return (
    <div
      className={cn(
        "x-group x-my-4 x-flex x-w-max x-cursor-pointer x-select-none x-items-center x-divide-x-2 x-divide-border/50 x-overflow-hidden x-rounded-lg x-border x-border-border/50 x-bg-secondary x-transition-all hover:x-border-primary",
        {
          "x-border-primary": isSelected,
        },
      )}
      onClick={() => {
        canvasStore.setState((draft) => {
          draft.selectedCodeBlockLocation = {
            messageBlockIndex: sourceMessageBlockIndex,
            codeBlockIndex: sourceCodeBlockIndex,
          };
          draft.state = "preview";
          draft.isCanvasListOpen = false;
        });
      }}
    >
      <div
        className={cn(
          "x-group-hover:x-bg-primary/10 x-flex x-size-16 x-items-center x-justify-center",
          {
            "x-bg-primary/10": isSelected,
          },
        )}
      >
        {isInFlight ? (
          <LuLoaderCircle className="x-size-4 x-animate-spin x-text-muted-foreground" />
        ) : (
          <placeholderElements.icon className="x-size-8" />
        )}
      </div>
      <div className="x-flex x-max-w-[300px] x-flex-col x-border-l x-bg-background x-px-4 x-py-2">
        <div
          className={cn(
            "x-line-clamp-1 x-text-base x-text-foreground x-transition-all group-hover:x-text-primary",
            {
              "x-text-primary": isSelected,
            },
          )}
        >
          {title.length > 0 ? title : placeholderElements.defaultTitle}
        </div>
        <div className="x-w-max x-text-sm x-text-muted-foreground">
          {isInFlight ? (
            <span className="x-animate-pulse">Generating...</span>
          ) : (
            placeholderElements.description
          )}
        </div>
      </div>
    </div>
  );
});

export default CanvasPlaceholderWrapper;
