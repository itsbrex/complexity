import { initFetchInterceptor } from "@/features/plugins/_core/network-intercept/interceptors/fetch";
import { initWebSocketInterceptor } from "@/features/plugins/_core/network-intercept/interceptors/web-socket";
import { initXhrInterceptor } from "@/features/plugins/_core/network-intercept/interceptors/xhr";

onlyMainWorldGuard();

initFetchInterceptor();
initXhrInterceptor();
initWebSocketInterceptor();
