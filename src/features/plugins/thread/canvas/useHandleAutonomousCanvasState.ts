import {
  useMirroredCodeBlocksStore,
  getMirroredCodeBlockByLocation,
} from "@/features/plugins/thread/better-code-blocks/store";
import {
  CanvasLanguage,
  getInterpretedCanvasLanguage,
  isAutonomousCanvasLanguageString,
} from "@/features/plugins/thread/canvas/canvas.types";
import { CANVAS_INITIAL_STATE } from "@/features/plugins/thread/canvas/canvases";
import {
  canvasStore,
  useCanvasStore,
} from "@/features/plugins/thread/canvas/store";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";

export default function useHandleAutonoumousCanvasState() {
  const enabled =
    ExtensionLocalStorageService.getCachedSync().plugins["thread:canvas"]
      .mode === "auto";

  const selectedCodeBlockLocation = useCanvasStore(
    (state) => state.selectedCodeBlockLocation,
  );
  const isCanvasOpen = selectedCodeBlockLocation !== null;

  const hasAutoPreviewTriggered = useCanvasStore(
    (state) => state.hasAutoPreviewTriggered,
  );
  const mirroredCodeBlocks = useMirroredCodeBlocksStore().blocks;
  const selectedCodeBlock = getMirroredCodeBlockByLocation({
    mirroredCodeBlocks,
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });

  useEffect(
    function handleInFlightCodeBlocks() {
      if (!enabled) return;

      messageBlockLoop: for (
        let messageIndex = mirroredCodeBlocks.length - 1;
        messageIndex >= 0;
        messageIndex--
      ) {
        const messageBlock = mirroredCodeBlocks[messageIndex];

        if (!messageBlock) continue;

        for (
          let codeIndex = messageBlock.length - 1;
          codeIndex >= 0;
          codeIndex--
        ) {
          const codeBlock = messageBlock[codeIndex];

          if (!codeBlock) continue;

          if (
            !codeBlock.language ||
            !isAutonomousCanvasLanguageString(codeBlock.language)
          )
            continue;

          const isCurrentlySelected =
            messageIndex === selectedCodeBlockLocation?.messageBlockIndex &&
            codeIndex === selectedCodeBlockLocation?.codeBlockIndex;

          if (!codeBlock.isInFlight || isCurrentlySelected) continue;

          const lastAutoOpenCodeBlockLocation =
            canvasStore.getState().lastAutoOpenCodeBlockLocation;

          if (
            lastAutoOpenCodeBlockLocation &&
            lastAutoOpenCodeBlockLocation.messageBlockIndex === messageIndex &&
            lastAutoOpenCodeBlockLocation.codeBlockIndex === codeIndex
          )
            continue;

          canvasStore.setState((draft) => {
            draft.selectedCodeBlockLocation = {
              messageBlockIndex: messageIndex,
              codeBlockIndex: codeIndex,
            };
            draft.state =
              CANVAS_INITIAL_STATE[
                getInterpretedCanvasLanguage(
                  codeBlock.language as CanvasLanguage,
                ) as CanvasLanguage
              ];
            draft.hasAutoPreviewTriggered = false;
            draft.lastAutoOpenCodeBlockLocation = {
              messageBlockIndex: messageIndex,
              codeBlockIndex: codeIndex,
            };
            draft.isCanvasListOpen = false;
          });

          break messageBlockLoop;
        }
      }
    },
    [
      selectedCodeBlockLocation?.messageBlockIndex,
      selectedCodeBlockLocation?.codeBlockIndex,
      mirroredCodeBlocks,
      isCanvasOpen,
      enabled,
    ],
  );

  const autoPreviewTimeoutHandleRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(
    function handleAutoPreview() {
      if (!enabled) return;

      const shouldTriggerAutoPreview =
        isCanvasOpen &&
        !hasAutoPreviewTriggered &&
        selectedCodeBlock &&
        !selectedCodeBlock.isInFlight &&
        selectedCodeBlockLocation != null &&
        selectedCodeBlock ===
          mirroredCodeBlocks[selectedCodeBlockLocation.messageBlockIndex]?.[
            selectedCodeBlockLocation.codeBlockIndex
          ];

      if (!shouldTriggerAutoPreview) return;

      canvasStore.setState((draft) => {
        draft.hasAutoPreviewTriggered = true;
      });

      if (autoPreviewTimeoutHandleRef.current)
        clearTimeout(autoPreviewTimeoutHandleRef.current);

      autoPreviewTimeoutHandleRef.current = setTimeout(() => {
        canvasStore.setState((draft) => {
          draft.state = "preview";
        });
      }, 500);
    },
    [
      selectedCodeBlock,
      isCanvasOpen,
      hasAutoPreviewTriggered,
      selectedCodeBlockLocation,
      mirroredCodeBlocks,
      enabled,
    ],
  );
}
