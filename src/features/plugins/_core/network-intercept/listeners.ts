import { onMessage } from "webext-bridge/content-script";

import {
  FetchEventData,
  WebSocketEventData,
  XhrEventData,
} from "@/features/plugins/_core/network-intercept/listeners.types";
import MiddlewareManager from "@/features/plugins/_core/network-intercept/MiddlewareManager";

onlyExtensionGuard();

export function setupNetworkInterceptListeners() {
  setupInterceptorsListeners();
}

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

      const newPayload = await MiddlewareManager.executeMiddlewares({
        data: { type: "network-intercept:webSocketEvent", event, payload },
      });

      return newPayload.payload;
    },
  );

  onMessage(
    "network-intercept:xhrEvent",
    async ({ data: { event, payload } }) => {
      // console.log("%cxhrEvent", "color: green", { event, payload });

      const newPayload = await MiddlewareManager.executeMiddlewares({
        data: { type: "network-intercept:xhrEvent", event, payload },
      });

      return newPayload.payload;
    },
  );

  onMessage(
    "network-intercept:fetchEvent",
    async ({ data: { event, payload } }) => {
      // console.log("%cfetchEvent", "color: red", { event, payload });

      const newPayload = await MiddlewareManager.executeMiddlewares({
        data: { type: "network-intercept:fetchEvent", event, payload },
      });

      return newPayload.payload;
    },
  );
}
