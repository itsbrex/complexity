import { onMessage } from "webext-bridge/content-script";

import { networkInterceptMiddlewareManager } from "@/plugins/_api/network-intercept-middleware-manager/middleware-manager";
import {
  FetchEventData,
  WebSocketEventData,
  XhrEventData,
} from "@/plugins/_core/network-intercept/listeners.types";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";

onlyExtensionGuard();

export type InterceptorsEvents = {
  "network-intercept:webSocketEvent": (
    event: WebSocketEventData,
  ) => WebSocketEventData["payload"];
  "network-intercept:xhrEvent": (
    event: XhrEventData,
  ) => XhrEventData["payload"];
  "network-intercept:fetchEvent": (
    event: FetchEventData,
  ) => FetchEventData["payload"];
};

function setupInterceptorsListeners() {
  onMessage(
    "network-intercept:webSocketEvent",
    async ({ data: { event, payload } }) => {
      // console.log("%cwebSocketEvent", "color: blue", { event, payload });

      const newPayload = await networkInterceptMiddlewareManager.executeMiddlewares({
        data: { type: "network-intercept:webSocketEvent", event, payload },
      });

      return newPayload.payload;
    },
  );

  onMessage(
    "network-intercept:xhrEvent",
    async ({ data: { event, payload } }) => {
      // console.log("%cxhrEvent", "color: green", { event, payload });

      const newPayload = await networkInterceptMiddlewareManager.executeMiddlewares({
        data: { type: "network-intercept:xhrEvent", event, payload },
      });

      return newPayload.payload;
    },
  );

  onMessage(
    "network-intercept:fetchEvent",
    async ({ data: { event, payload } }) => {
      // console.log("%cfetchEvent", "color: red", { event, payload });

      const newPayload = await networkInterceptMiddlewareManager.executeMiddlewares({
        data: { type: "network-intercept:fetchEvent", event, payload },
      });

      return newPayload.payload;
    },
  );
}

csLoaderRegistry.register({
  id: "messaging:networkIntercept",
  loader: setupInterceptorsListeners,
});
