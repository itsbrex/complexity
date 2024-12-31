import { useMutation } from "@tanstack/react-query";
import { LuLoaderCircle } from "react-icons/lu";
import { sendMessage } from "webext-bridge/content-script";

import {
  getMirroredCodeBlockByLocation,
  useMirroredCodeBlocksStore,
} from "@/features/plugins/thread/better-code-blocks/store";
import { useCanvasStore } from "@/features/plugins/thread/canvas/store";

export default function MermaidRenderer() {
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

  const code = selectedCodeBlock?.codeString;

  const {
    mutate,
    isPending,
    isSuccess,
    data: result,
  } = useMutation({
    mutationFn: async () => {
      return await sendMessage(
        "mermaidRenderer:render",
        {
          selector: "#canvas-mermaid-container",
        },
        "window",
      );
    },
  });

  useEffect(() => {
    setTimeout(() => {
      mutate();
    }, 300);
  }, [mutate, code]);

  return (
    <div className="tw-relative tw-size-full">
      {isSuccess && !result && (
        <div className="tw-absolute tw-inset-1/2 tw-w-max -tw-translate-x-1/2 -tw-translate-y-1/2 tw-animate-in tw-fade-in">
          Failed to render provided mermaid code. Try to reload the Canvas.
        </div>
      )}
      <div
        id="canvas-mermaid-container"
        className={cn("tw-size-full tw-transition-opacity", {
          "tw-opacity-0": !isSuccess,
        })}
      >
        {code}
      </div>
      {(isPending || result == null) && (
        <div className="tw-absolute tw-inset-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2 tw-animate-in tw-fade-in">
          <LuLoaderCircle className="tw-size-10 tw-animate-spin tw-text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
