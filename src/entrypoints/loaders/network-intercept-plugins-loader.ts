import { setupBlockAnalyticEventsNetworkInterceptMiddleware } from "@/features/plugins/block-analytic-events/network-intercept-middlewares";
import { setupLanguageModelSelectorNetworkInterceptMiddleware } from "@/features/plugins/query-box/language-model-selector/network-intercept-middlewares";
import { setupPplxApiNetworkInterceptMiddlewares } from "@/services/pplx-api/network-intercept-middlewares";

export function setupNetworkInterceptPlugins() {
  setupPplxApiNetworkInterceptMiddlewares();
  setupBlockAnalyticEventsNetworkInterceptMiddleware();
  setupLanguageModelSelectorNetworkInterceptMiddleware();
}
