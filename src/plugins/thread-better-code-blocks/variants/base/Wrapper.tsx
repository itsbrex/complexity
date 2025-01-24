import { useCanvasStore } from "@/plugins/canvas/store";
import { useMirroredCodeBlockContext } from "@/plugins/thread-better-code-blocks/MirroredCodeBlockContext";
import BetterCodeBlockHeader from "@/plugins/thread-better-code-blocks/variants/base/Header";
import HighlightedCodeWrapper from "@/plugins/thread-better-code-blocks/variants/HighlightedCode";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";

const BaseCodeBlockWrapper = memo(function BaseCodeBlockWrapper() {
  const { maxHeight, sourceMessageBlockIndex, sourceCodeBlockIndex } =
    useMirroredCodeBlockContext()((state) => ({
      maxHeight: state.maxHeight,
      sourceMessageBlockIndex: state.sourceMessageBlockIndex,
      sourceCodeBlockIndex: state.sourceCodeBlockIndex,
    }));

  const isCanvasEnabled =
    ExtensionLocalStorageService.getCachedSync().plugins["thread:canvas"]
      .enabled;
  const selectedCanvasCodeBlockLocation = useCanvasStore(
    (state) => state.selectedCodeBlockLocation,
  );
  const isSelectedCanvasCodeBlock =
    selectedCanvasCodeBlockLocation?.messageBlockIndex ===
      sourceMessageBlockIndex &&
    selectedCanvasCodeBlockLocation?.codeBlockIndex === sourceCodeBlockIndex;

  return (
    <div
      className={cn(
        "tw-relative tw-my-4 tw-flex tw-flex-col tw-rounded-md tw-border tw-border-border/50 tw-bg-secondary tw-font-mono tw-transition-all",
        {
          "tw-overflow-hidden": maxHeight === 0,
          "tw-border-primary": isCanvasEnabled && isSelectedCanvasCodeBlock,
        },
      )}
    >
      <BetterCodeBlockHeader />
      <HighlightedCodeWrapper />
    </div>
  );
});

export default BaseCodeBlockWrapper;
