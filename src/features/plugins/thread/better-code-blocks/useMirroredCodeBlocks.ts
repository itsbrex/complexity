import debounce from "lodash/debounce";
import { useMemo, useCallback } from "react";
import { sendMessage } from "webext-bridge/content-script";

import { CallbackQueue } from "@/features/plugins/_core/dom-observer/callback-queue";
import {
  ExtendedCodeBlock,
  useGlobalDomObserverStore,
} from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS } from "@/utils/dom-selectors";

export type MirroredCodeBlock = ExtendedCodeBlock & {
  portalContainer: HTMLElement | null;
  codeString: string | null;
  language: string | null;
};

const OBSERVER_ID =
  DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD
    .MIRRORED_CODE_BLOCK;

export function useMirroredCodeBlocks(): MirroredCodeBlock[][] {
  const [mirroredCodeBlocks, setMirroredCodeBlocks] = useState<
    MirroredCodeBlock[][]
  >([]);
  const codeBlocks = useGlobalDomObserverStore(
    (state) => state.threadComponents.codeBlocks,
  );

  const processCodeBlock = useCallback(
    async (
      codeBlock: ExtendedCodeBlock,
      messageBlockIndex: number,
      codeBlockIndex: number,
    ): Promise<MirroredCodeBlock> => {
      const $existingPortalContainer = codeBlock.$wrapper.prev();

      const codeData = await sendMessage(
        "reactVdom:getCodeFromCodeBlock",
        {
          messageBlockIndex,
          codeBlockIndex,
        },
        "window",
      );

      if (!codeData) {
        return {
          ...codeBlock,
          portalContainer: null,
          codeString: null,
          language: null,
        };
      }

      if (
        $existingPortalContainer.length &&
        $existingPortalContainer.internalComponentAttr() === OBSERVER_ID
      ) {
        return {
          ...codeBlock,
          portalContainer: $existingPortalContainer[0],
          codeString: codeData.code,
          language: codeData.language,
        };
      }

      const $portalContainer = $("<div>")
        .internalComponentAttr(OBSERVER_ID)
        .attr({
          "data-language": codeData.language,
          "data-index": codeBlockIndex,
        });

      codeBlock.$wrapper.before($portalContainer);

      return {
        ...codeBlock,
        portalContainer: $portalContainer[0],
        codeString: codeData.code,
        language: codeData.language,
      };
    },
    [],
  );

  const debouncedProcessBlocks = useMemo(
    () =>
      debounce((blocks: ExtendedCodeBlock[][]) => {
        CallbackQueue.getInstance().enqueue(async () => {
          try {
            const processedBlocks = await Promise.all(
              blocks.map((messageBlock, sourceMessageBlockIndex) =>
                Promise.all(
                  messageBlock.map((codeBlock, sourceCodeBlockIndex) =>
                    processCodeBlock(
                      codeBlock,
                      sourceMessageBlockIndex,
                      sourceCodeBlockIndex,
                    ),
                  ),
                ),
              ),
            );
            setMirroredCodeBlocks(processedBlocks);
          } catch (error) {
            console.error("Error processing mirrored code blocks:", error);
            setMirroredCodeBlocks([]);
          }
        }, "process-code-blocks");
      }, 0),
    [processCodeBlock],
  );

  useEffect(() => {
    if (!codeBlocks) return;

    debouncedProcessBlocks(codeBlocks);

    return () => {
      debouncedProcessBlocks.cancel();
    };
  }, [codeBlocks, debouncedProcessBlocks]);

  return mirroredCodeBlocks;
}
