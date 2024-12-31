import { useGlobalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { useMirroredCodeBlocksStore } from "@/features/plugins/thread/better-code-blocks/store";
import {
  isAutonomousCanvasLanguageString,
  isCanvasLanguageString,
} from "@/features/plugins/thread/canvas/canvas.types";
import {
  canvasStore,
  useCanvasStore,
} from "@/features/plugins/thread/canvas/store";

export function useHandleCanvasState() {
  const selectedCodeBlockLocation = useCanvasStore(
    (state) => state.selectedCodeBlockLocation,
  );
  const mirroredCodeBlocks = useMirroredCodeBlocksStore().blocks;
  const threadCodeBlocks = useGlobalDomObserverStore(
    (state) => state.threadComponents.codeBlocks,
  );

  useEffect(
    function handleCanvasOpenStateChange() {
      if (!selectedCodeBlockLocation) {
        canvasStore.setState((draft) => {
          draft.isValidCanvasCode = false;
        });
        return;
      }

      const { messageBlockIndex, codeBlockIndex } = selectedCodeBlockLocation;
      const messageBlocks = mirroredCodeBlocks[messageBlockIndex];
      const codeBlock = messageBlocks?.[codeBlockIndex];

      const isValidCanvasCode =
        codeBlock?.codeString != null &&
        codeBlock?.language != null &&
        (isCanvasLanguageString(codeBlock.language) ||
          isAutonomousCanvasLanguageString(codeBlock.language));

      canvasStore.setState((draft) => {
        draft.isValidCanvasCode = isValidCanvasCode;
      });
    },
    [mirroredCodeBlocks, selectedCodeBlockLocation],
  );

  useEffect(
    function handleCanvasClose() {
      if (!selectedCodeBlockLocation) return;

      const { messageBlockIndex, codeBlockIndex } = selectedCodeBlockLocation;
      const codeBlockExists =
        threadCodeBlocks?.[messageBlockIndex]?.[codeBlockIndex] != null;

      if (!codeBlockExists) {
        canvasStore.getState().close();
      }
    },
    [selectedCodeBlockLocation, threadCodeBlocks],
  );
}
