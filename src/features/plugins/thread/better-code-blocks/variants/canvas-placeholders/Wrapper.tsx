import { LuLoaderCircle } from "react-icons/lu";

import { useMirroredCodeBlockContext } from "@/features/plugins/thread/better-code-blocks/MirroredCodeBlockContext";
import {
  CanvasLanguage,
  formatCanvasTitle,
  getCanvasTitle,
  getInterpretedCanvasLanguage,
} from "@/features/plugins/thread/canvas/canvas.types";
import { CANVAS_PLACEHOLDERS } from "@/features/plugins/thread/canvas/canvases";
import {
  canvasStore,
  useCanvasStore,
} from "@/features/plugins/thread/canvas/store";

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
        "tw-group tw-my-4 tw-flex tw-w-max tw-cursor-pointer tw-select-none tw-items-center tw-divide-x-2 tw-divide-border/50 tw-overflow-hidden tw-rounded-lg tw-border tw-border-border/50 tw-bg-secondary tw-transition-all hover:tw-border-primary",
        {
          "tw-border-primary": isSelected,
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
          "tw-group-hover:tw-bg-primary/10 tw-flex tw-size-16 tw-items-center tw-justify-center",
          {
            "tw-bg-primary/10": isSelected,
          },
        )}
      >
        {isInFlight ? (
          <LuLoaderCircle className="tw-size-4 tw-animate-spin tw-text-muted-foreground" />
        ) : (
          <placeholderElements.icon className="tw-size-8" />
        )}
      </div>
      <div className="tw-flex tw-max-w-[300px] tw-flex-col tw-border-l tw-bg-background tw-px-4 tw-py-2">
        <div
          className={cn(
            "tw-line-clamp-1 tw-text-base tw-text-foreground tw-transition-all group-hover:tw-text-primary",
            {
              "tw-text-primary": isSelected,
            },
          )}
        >
          {title.length > 0 ? title : placeholderElements.defaultTitle}
        </div>
        <div className="tw-w-max tw-text-sm tw-text-muted-foreground">
          {isInFlight ? (
            <span className="tw-animate-pulse">Generating...</span>
          ) : (
            placeholderElements.description
          )}
        </div>
      </div>
    </div>
  );
});

export default CanvasPlaceholderWrapper;
