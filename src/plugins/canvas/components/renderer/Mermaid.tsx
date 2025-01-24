import { useMutation } from "@tanstack/react-query";
import { LuLoaderCircle } from "react-icons/lu";
import { sendMessage } from "webext-bridge/content-script";

import { Button } from "@/components/ui/button";
import { useColorSchemeStore } from "@/data/color-scheme-store";
import {
  formatCanvasTitle,
  getCanvasTitle,
  isAutonomousCanvasLanguageString,
} from "@/plugins/canvas/canvas.types";
import { useCanvasStore } from "@/plugins/canvas/store";
import {
  getMirroredCodeBlockByLocation,
  useMirroredCodeBlocksStore,
} from "@/plugins/thread-better-code-blocks/store";
import { UiUtils } from "@/utils/ui-utils";

export default function MermaidRenderer() {
  const { colorScheme } = useColorSchemeStore();

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

  const isAutonomousCanvas = isAutonomousCanvasLanguageString(
    selectedCodeBlock?.language,
  );
  const title = formatCanvasTitle(getCanvasTitle(selectedCodeBlock?.language));

  const code = selectedCodeBlock?.codeString;
  const isInFlight = selectedCodeBlock?.isInFlight;

  const [refreshKey, refreshContainer] = useReducer((state) => state + 1, 0);

  const {
    mutate,
    isPending,
    isSuccess: mermaidRendererResponded,
    data: result,
  } = useMutation({
    mutationFn: async () => {
      return await sendMessage(
        "mermaidRenderer:render",
        {
          selector: `#canvas-mermaid-container-${selectedCodeBlockLocation?.messageBlockIndex}-${selectedCodeBlockLocation?.codeBlockIndex}`,
        },
        "window",
      );
    },
  });

  const isSuccess = result?.success;

  useEffect(() => {
    if (isInFlight) return;

    refreshContainer();
    setTimeout(() => {
      mutate();
    }, 0);
  }, [mutate, code, colorScheme, isInFlight]);

  return (
    <div key={refreshKey} className="tw-relative tw-size-full">
      {!isPending &&
        mermaidRendererResponded &&
        !isSuccess &&
        !result?.error && (
          <div className="tw-absolute tw-inset-1/2 tw-w-max -tw-translate-x-1/2 -tw-translate-y-1/2">
            <span className="tw-animate-in tw-fade-in">
              Failed to render provided mermaid code. Try to reload the Canvas.
            </span>
          </div>
        )}
      {!isPending &&
        mermaidRendererResponded &&
        !isSuccess &&
        result?.error && (
          <div className="tw-flex tw-flex-col tw-gap-4 tw-p-4 tw-font-mono">
            <div className="tw-text-lg tw-font-bold tw-text-destructive">
              An error occurred while rendering:
            </div>
            <div className="tw-whitespace-pre tw-animate-in tw-fade-in">
              {result.error}
            </div>
            <Button
              className="tw-w-max"
              variant="destructive"
              onClick={() => {
                const $textarea = UiUtils.getActiveQueryBoxTextarea();
                if (!$textarea.length) return;

                const errorText = `${isAutonomousCanvas && title ? `An error occurred while rendering "${title}": ` : ""}\n\n${result.error}`;

                $textarea.trigger("focus");
                document.execCommand("insertText", false, errorText);
              }}
            >
              Fix Error
            </Button>
          </div>
        )}
      <div
        id={`canvas-mermaid-container-${selectedCodeBlockLocation?.messageBlockIndex}-${selectedCodeBlockLocation?.codeBlockIndex}`}
        className={cn("tw-size-full tw-text-secondary tw-transition-opacity", {
          "tw-opacity-0": !mermaidRendererResponded || !isSuccess,
        })}
      >
        {code}
      </div>
      {(isPending || isSuccess == null) && (
        <div className="tw-absolute tw-inset-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2 tw-animate-in tw-fade-in">
          <LuLoaderCircle className="tw-size-10 tw-animate-spin tw-text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
