import { useMutation } from "@tanstack/react-query";
import { LuLoaderCircle } from "react-icons/lu";
import { sendMessage } from "webext-bridge/content-script";

import { Button } from "@/components/ui/button";
import { useColorSchemeStore } from "@/data/color-scheme-store";
import {
  getMirroredCodeBlockByLocation,
  useMirroredCodeBlocksStore,
} from "@/features/plugins/thread/better-code-blocks/store";
import {
  formatCanvasTitle,
  getCanvasTitle,
  isAutonomousCanvasLanguageString,
} from "@/features/plugins/thread/canvas/canvas.types";
import { useCanvasStore } from "@/features/plugins/thread/canvas/store";
import UiUtils from "@/utils/UiUtils";

export default function MarkmapRenderer() {
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

  const {
    mutate,
    isPending,
    isSuccess: markmapRendererResponded,
    data: result,
  } = useMutation({
    mutationFn: async ({ code }: { code: string }) => {
      return await sendMessage(
        "markmapRenderer:render",
        {
          selector: `#canvas-markmap-container-${selectedCodeBlockLocation?.messageBlockIndex}-${selectedCodeBlockLocation?.codeBlockIndex}`,
          content: code,
        },
        "window",
      );
    },
  });

  const isSuccess = result?.success;

  useEffect(() => {
    if (!code) return;

    mutate({ code });
  }, [mutate, code, colorScheme]);

  return (
    <div className="tw-relative tw-size-full">
      {!isPending &&
        markmapRendererResponded &&
        !isSuccess &&
        !result?.error && (
          <div className="tw-absolute tw-inset-1/2 tw-w-max -tw-translate-x-1/2 -tw-translate-y-1/2">
            <span className="tw-animate-in tw-fade-in">
              Failed to render provided markmap code. Try to reload the Canvas.
            </span>
          </div>
        )}
      {!isPending &&
        markmapRendererResponded &&
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
      <svg
        id={`canvas-markmap-container-${selectedCodeBlockLocation?.messageBlockIndex}-${selectedCodeBlockLocation?.codeBlockIndex}`}
        className={cn(
          "tw-size-full !tw-font-sans !tw-text-foreground tw-transition-opacity",
          {
            "tw-opacity-0": !markmapRendererResponded || !isSuccess,
          },
        )}
      />
      {(isPending || isSuccess == null) && (
        <div className="tw-absolute tw-inset-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2 tw-animate-in tw-fade-in">
          <LuLoaderCircle className="tw-size-10 tw-animate-spin tw-text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
