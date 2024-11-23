import debounce from "lodash/debounce";
import { useMemo, useCallback } from "react";
import { sendMessage } from "webext-bridge/content-script";

import {
  ExtendedCodeBlock,
  useGlobalDomObserverStore,
} from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { DOM_INTERNAL_SELECTORS } from "@/utils/dom-selectors";

export type MirroredCodeBlock = ExtendedCodeBlock & {
  portalContainer: HTMLElement | null;
  codeString: string | null;
  lang: string | null;
};

const OBSERVER_ID =
  DOM_INTERNAL_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.MIRRORED_CODE_BLOCK.slice(
    1,
  );

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
          lang: null,
        };
      }

      if (
        $existingPortalContainer.length &&
        $existingPortalContainer.hasClass(OBSERVER_ID)
      ) {
        return {
          ...codeBlock,
          portalContainer: $existingPortalContainer[0],
          codeString: codeData.code,
          lang: codeData.language,
        };
      }

      const $portalContainer = $("<div>").addClass(OBSERVER_ID).attr({
        "data-lang": codeData.language,
        "data-index": codeBlockIndex,
      });

      codeBlock.$wrapper.before($portalContainer);

      return {
        ...codeBlock,
        portalContainer: $portalContainer[0],
        codeString: codeData.code,
        lang: codeData.language,
      };
    },
    [],
  );

  const debouncedProcessBlocks = useMemo(
    () =>
      debounce(async (blocks: ExtendedCodeBlock[][]) => {
        try {
          const processedBlocks = await Promise.all(
            blocks.map((messageBlock, messageBlockIndex) =>
              Promise.all(
                messageBlock.map((codeBlock, codeBlockIndex) =>
                  processCodeBlock(
                    codeBlock,
                    messageBlockIndex,
                    codeBlockIndex,
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
      }, 0),
    [processCodeBlock],
  );

  useEffect(() => {
    if (!codeBlocks) return;

    requestAnimationFrame(() => {
      debouncedProcessBlocks(codeBlocks);
    });

    return () => {
      debouncedProcessBlocks.cancel();
    };
  }, [codeBlocks, debouncedProcessBlocks]);

  return mirroredCodeBlocks;
}
