import "@/utils/jquery.extensions";
import "@/entrypoints/content-scripts/loaders";

import { showInitializingIndicator } from "@/components/loading-indicator";
import { csLoaderRegistry } from "@/services/cs-loader-registry";
import { contentScriptGuard } from "@/utils/content-scripts-guard";

$(showInitializingIndicator);

contentScriptGuard();

csLoaderRegistry.executeAll();
