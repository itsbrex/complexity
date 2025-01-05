import "@/utils/jquery.extensions";

import { showInitializingIndicator } from "@/entrypoints/content-scripts/loading-indicator";
import { CsLoaderRegistry } from "@/services/cs-loader-registry";
import { contentScriptGuard } from "@/utils/content-scripts-guard";

import "@/entrypoints/content-scripts/loaders";

$(showInitializingIndicator);

contentScriptGuard();

CsLoaderRegistry.executeAll();
