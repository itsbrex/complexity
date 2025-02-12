import { produce } from "immer";
import { sendMessage } from "webext-bridge/content-script";

import { isReasoningLanguageModelCode } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { CallbackQueue } from "@/plugins/_api/dom-observer/callback-queue";
import { networkInterceptMiddlewareManager } from "@/plugins/_api/network-intercept-middleware-manager/middleware-manager";
import {
  encodeWebSocketData,
  parseWebSocketData,
} from "@/plugins/_core/network-intercept/web-socket-message-parser";
import { INTERNAL_ATTRIBUTES } from "@/utils/dom-selectors";

export async function handleInstantRewrite({
  messageBlockIndex,
}: {
  messageBlockIndex: number;
}) {
  const currentModelPreferences = await sendMessage(
    "reactVdom:getMessageModelPreferences",
    {
      index: messageBlockIndex,
    },
    "window",
  );

  if (currentModelPreferences == null) return;

  const $proSearchPanel = $(
    `[data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.BLOCK}"][data-index="${messageBlockIndex}"] [data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.TEXT_COL_CHILD.QUERY}"]`,
  )
    .next()
    .find("> div > div[data-test-id]:first-child");

  const isProSearchEnabled = $proSearchPanel.length > 0;

  networkInterceptMiddlewareManager.addMiddleware({
    id: "instant-rewrite-model-change",
    middlewareFn({ data, skip }) {
      if (data.type === "network-intercept:fetchEvent") {
        return skip();
      }

      const wsMessage = parseWebSocketData(data.payload.data);
      const payload = wsMessage.payload;

      const hasValidMessageStructure =
        wsMessage.messageId != null &&
        Array.isArray(payload) &&
        payload.length > 0 &&
        payload[0] != null;

      if (!hasValidMessageStructure) {
        return skip();
      }

      if (payload.length < 3) {
        return skip();
      }

      const isPerplexityAskMessage = payload[0] === "perplexity_ask";

      if (!isPerplexityAskMessage) return skip();

      networkInterceptMiddlewareManager.removeMiddleware(
        "instant-rewrite-model-change",
      );

      const isReasoningMode = isReasoningLanguageModelCode(
        currentModelPreferences.displayModel,
      );

      const newPayload = produce(payload, (draft) => {
        draft[2].mode =
          isReasoningMode || isProSearchEnabled ? "copilot" : "concise";
        draft[2].model_preference = currentModelPreferences.displayModel;
      });

      return encodeWebSocketData({
        type: "message",
        data: `${wsMessage.messageId}${JSON.stringify(newPayload)}`,
      });
    },
  });

  setTimeout(() => {
    networkInterceptMiddlewareManager.removeMiddleware(
      "instant-rewrite-model-change",
    );
  }, 1000);

  CallbackQueue.getInstance().enqueue(() => {
    sendMessage(
      "reactVdom:triggerRewriteOption",
      {
        messageBlockIndex,
      },
      "window",
    );
  }, "plugin:instantRewriteButton:handleInstantRewrite");
}
