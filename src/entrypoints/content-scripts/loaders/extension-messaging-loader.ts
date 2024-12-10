import { allowWindowMessaging } from "webext-bridge/content-script";

import { setupNetworkInterceptListeners } from "@/features/plugins/_core/network-intercept/listeners";
import { setupSpaRouterDispatchListeners } from "@/features/plugins/_core/spa-router/listeners";

export function setupExtensionMessaging() {
  allowWindowMessaging("com.complexity");
  setupNetworkInterceptListeners();
  setupSpaRouterDispatchListeners();
}
