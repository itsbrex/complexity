import { sendMessage } from "webext-bridge/content-script";

import { networkInterceptMiddlewareManager } from "@/plugins/_api/network-intercept-middleware-manager/middleware-manager";
import {
  encodeWebSocketData,
  parseWebSocketData,
} from "@/plugins/_core/network-intercept/web-socket-message-parser";

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

      const modelPreferenceKey = currentModelPreferences.isProReasoningMode
        ? "reasoning_model_preference"
        : "model_preference";

      const newPayload = [
        ...payload.slice(0, 2),
        {
          ...payload[2],
          mode: currentModelPreferences.isProReasoningMode
            ? currentModelPreferences.mode.toLowerCase()
            : payload[2].mode,
          is_pro_reasoning_mode: currentModelPreferences.isProReasoningMode,
          [modelPreferenceKey]: currentModelPreferences.displayModel,
        },
      ];

      return encodeWebSocketData({
        type: "message",
        data: `${wsMessage.messageId}${JSON.stringify(newPayload)}`,
      });
    },
  });

  sendMessage(
    "reactVdom:triggerRewriteOption",
    {
      messageBlockIndex,
    },
    "window",
  );
}
