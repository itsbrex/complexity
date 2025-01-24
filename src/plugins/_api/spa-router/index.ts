import { setupSpaRouterListeners } from "@/plugins/_api/spa-router/listeners.main-world";
import { proxyNextRouter } from "@/plugins/_api/spa-router/spa-router";
import { waitForNextjsGlobalObj } from "@/plugins/_api/spa-router/utils";

onlyMainWorldGuard();

await waitForNextjsGlobalObj();

proxyNextRouter();
setupSpaRouterListeners();
