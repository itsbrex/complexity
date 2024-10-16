import { setupSpaRouterListeners } from "@/features/plugins/_core/spa-router/listeners.main";
import { proxyNextRouter } from "@/features/plugins/_core/spa-router/spa-router";
import { waitForNextjsGlobalObj } from "@/features/plugins/_core/spa-router/utils";

onlyMainWorldGuard();

await waitForNextjsGlobalObj();

proxyNextRouter();
setupSpaRouterListeners();
