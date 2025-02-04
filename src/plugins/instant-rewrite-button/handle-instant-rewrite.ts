import { produce } from "immer";
import { sendMessage } from "webext-bridge/content-script";

import { isReasoningLanguageModelCode } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { networkInterceptMiddlewareManager } from "@/plugins/_api/network-intercept-middleware-manager/middleware-manager";
import {
  encodeWebSocketData,
  parseWebSocketData,
} from "@/plugins/_core/network-intercept/web-socket-message-parser";
import { DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS } from "@/utils/dom-selectors";

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

  const $proSearchPanel = $(
    `[data-cplx-component="${DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.MESSAGE.BLOCK}"][data-index="${messageBlockIndex}"] [data-cplx-component="${DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.QUERY}"]`,
  )
    .next()
    .find("> div[data-test-id]:first-child");

  if (!$proSearchPanel.length) return;

  const isProSearchEnabled =
    $proSearchPanel.find(`svg[data-icon="copilot"]`).length > 0;

  if (currentModelPreferences == null) return;

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

      const isProReasoningMode = isReasoningLanguageModelCode(
        currentModelPreferences.displayModel,
      );

      const modelPreferenceKey = isProReasoningMode
        ? "reasoning_model_preference"
        : "model_preference";

      const toDeleteKey = isProReasoningMode
        ? "model_preference"
        : "reasoning_model_preference";

      const newPayload = produce(payload, (draft) => {
        delete payload[2][toDeleteKey];
        draft[2].mode = isProSearchEnabled ? "copilot" : "concise";
        draft[2].is_pro_reasoning_mode = isProReasoningMode;
        draft[2][modelPreferenceKey] = currentModelPreferences.displayModel;
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

  sendMessage(
    "reactVdom:triggerRewriteOption",
    {
      messageBlockIndex,
    },
    "window",
  );
}
