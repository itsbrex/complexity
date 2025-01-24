import {
  CanvasLanguage,
  getInterpretedCanvasLanguage,
  isAutonomousCanvasLanguageString,
} from "@/plugins/canvas/canvas.types";
import { CANVAS_INITIAL_STATE } from "@/plugins/canvas/canvases";
import { canvasStore, useCanvasStore } from "@/plugins/canvas/store";
import {
  useMirroredCodeBlocksStore,
  getMirroredCodeBlockByLocation,
} from "@/plugins/thread-better-code-blocks/store";

export default function useHandleAutonoumousCanvasState() {
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
    ],
  );

  useEffect(
    function handleAutoPreview() {
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

      canvasStore.setState((draft) => {
        draft.state = "preview";
      });
    },
    [
      selectedCodeBlock,
      isCanvasOpen,
      hasAutoPreviewTriggered,
      selectedCodeBlockLocation,
      mirroredCodeBlocks,
    ],
  );
}
