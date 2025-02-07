import { sendMessage } from "webext-bridge/content-script";

import { CodeBlock } from "@/plugins/_core/dom-observers/thread/code-blocks/types";
import { MessageBlock } from "@/plugins/_core/dom-observers/thread/message-blocks/types";
import { INTERNAL_ATTRIBUTES, DOM_SELECTORS } from "@/utils/dom-selectors";

export async function parseCodeBlocks(
  messageBlocks: MessageBlock[],
): Promise<CodeBlock[][]> {
  const codeBlocksChunksPromises = messageBlocks.map(
    async (messageBlock, i) => {
      if (messageBlock == null) return [];

      const codeBlocksChunks = $(messageBlock.nodes.$answer)
        .find(DOM_SELECTORS.THREAD.MESSAGE.CODE_BLOCK.WRAPPER)
        .toArray();

      const codeBlocksPromises = codeBlocksChunks.map(async (codeBlock, j) => {
        const $codeBlock = $(codeBlock);

        $codeBlock
          .internalComponentAttr(
            INTERNAL_ATTRIBUTES.THREAD.MESSAGE.TEXT_COL_CHILD.CODE_BLOCK,
          )
          .attr("data-index", j);

        const $pre = $codeBlock.find("pre");
        const $code = $pre.find("code");
        const $nativeHeader = $codeBlock.find(
          DOM_SELECTORS.THREAD.MESSAGE.CODE_BLOCK.NATIVE_HEADER,
        );
        const $nativeCopyButton = $codeBlock.find(
          DOM_SELECTORS.THREAD.MESSAGE.CODE_BLOCK.NATIVE_COPY_BUTTON,
        );

        const content = await getCodeBlockContent({
          messageBlockIndex: i,
          codeBlockIndex: j,
        });

        return {
          nodes: {
            $wrapper: $codeBlock,
            $pre,
            $code,
            $nativeHeader,
            $nativeCopyButton,
          },
          content,
          states: {
            isInFlight: isCodeBlockInFlight({
              messageBlocks,
              messageBlockIndex: i,
              codeBlockIndex: j,
            }),
          },
        };
      });

      return await Promise.all(codeBlocksPromises);
    },
  );

  return Promise.all(codeBlocksChunksPromises);
}

async function getCodeBlockContent({
  messageBlockIndex,
  codeBlockIndex,
}: {
  messageBlockIndex: number;
  codeBlockIndex: number;
}): Promise<CodeBlock["content"]> {
  const data = await sendMessage(
    "reactVdom:getCodeBlockContent",
    {
      messageBlockIndex,

      codeBlockIndex,
    },
    "window",
  );

  return {
    language: data?.language ?? "text",
    code: data?.code ?? "",
  };
}

function isCodeBlockInFlight({
  messageBlocks,

  messageBlockIndex,
  codeBlockIndex,
}: {
  messageBlocks: MessageBlock[];
  messageBlockIndex: number;
  codeBlockIndex: number;
}) {
  const isMessageBlockInFlight =
    messageBlocks[messageBlockIndex]?.states.isInFlight;

  if (!isMessageBlockInFlight) return false;

  const selector = `[data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.BLOCK}"][data-index="${messageBlockIndex}"] [data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.TEXT_COL_CHILD.CODE_BLOCK}"][data-index="${codeBlockIndex}"]`;

  const codeBlock = document.querySelector(selector);

  const parentElement = codeBlock?.parentElement;

  const hasAnimationWrapper = parentElement?.classList.contains("animate-in");

  if (hasAnimationWrapper) {
    return (
      !!messageBlocks[messageBlockIndex]?.states.isInFlight &&
      parentElement?.nextElementSibling == null
    );
  }

  return (
    !!messageBlocks[messageBlockIndex]?.states.isInFlight &&
    codeBlock?.nextElementSibling == null
  );
}
