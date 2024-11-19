import { LanguageModel } from "@/content-script/components/QueryBox";
import { webpageMessenger } from "@/content-script/main-world/webpage-messenger";
import { DomSelectors } from "@/utils/DomSelectors";
import { mainWorldExec, mainWorldOnly } from "@/utils/hof";
import { getReactFiberKey } from "@/utils/utils";

export type ReactNodeAction = keyof typeof actions;
export type ReactNodeActionReturnType = {
  [K in ReactNodeAction]: ReturnType<(typeof actions)[K]>;
};

export type PplxThreadMessageReactFiberResult = {
  answer: string;
  web_results: {
    name: string;
    url: string;
  }[];
};

const actions = {
  getCodeFromPreBlock: mainWorldOnly((pre: Element): string => {
    return (pre as any)[getReactFiberKey(pre)]?.memoizedProps?.children[0]
      ?.props?.children[0];
  }),
  getStreamingMessageData: mainWorldOnly(
    (messageBlock: Element): PplxThreadMessageReactFiberResult => {
      const $streamingNode = $(messageBlock).prev();
      const fiberNode = ($streamingNode[0] as any)[
        getReactFiberKey($streamingNode[0])
      ];

      return {
        answer: fiberNode?.return?.memoizedProps?.result?.blocks.reduce(
          (acc: string, block: any) => {
            if (block.markdown_block == null) return acc;

            return acc + block.markdown_block.chunks.join("");
          },
          "",
        ),
        web_results: fiberNode?.return?.memoizedProps?.result?.web_results,
      };
    },
  ),
  getMessageInflightStatus: mainWorldOnly((messageBlock: Element): string => {
    const result = getButtonBarFiberNode(messageBlock);
    return result?.status ?? "";
  }),
  getMessageDisplayModel: mainWorldOnly(
    (messageBlock: Element): LanguageModel["code"] | null => {
      const result = getButtonBarFiberNode(messageBlock);
      return result?.display_model ?? null;
    },
  ),
  getMessageBackendUuid: mainWorldOnly((messageBlock: Element): string => {
    const result = getButtonBarFiberNode(messageBlock);
    return result?.backend_uuid ?? "";
  }),
} as const;

mainWorldExec(() => {
  webpageMessenger.onMessage(
    "getReactNodeData",
    async ({ payload: { querySelector, action } }) => {
      const $node = $(querySelector);

      if (!$node.length) return;

      return actions[action]($node[0]);
    },
  );
})();

function getButtonBarFiberNode(messageBlock: Element) {
  const $buttonBar = $(messageBlock).find(
    DomSelectors.THREAD.MESSAGE.BOTTOM_BAR,
  );

  if (!$buttonBar.length) return null;

  return ($buttonBar[0] as any)[getReactFiberKey($buttonBar[0])]?.return
    ?.memoizedProps?.result;
}
