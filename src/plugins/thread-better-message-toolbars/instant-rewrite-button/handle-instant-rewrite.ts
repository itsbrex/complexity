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
  const currentModel = await sendMessage(
    "reactVdom:getMessageDisplayModelCode",
    {
      index: messageBlockIndex,
    },
    "window",
  );

  if (currentModel == null) return;

  networkInterceptMiddlewareManager.addMiddleware({
    id: "instant-rewrite-model-change",
    priority: { position: "last" },
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

      const newPayload = [
        ...payload.slice(0, 2),
        {
          ...payload[2],
          model_preference: currentModel,
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
      optionIndex: 1,
    },
    "window",
  );
}
