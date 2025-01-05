import "@/utils/jquery.extensions";
import "@/entrypoints/content-scripts/loaders";

// must keep this for tailwind to generate and hmr arbitrary classes in dev mode
import "@/assets/cs.css";

import { showInitializingIndicator } from "@/entrypoints/content-scripts/loading-indicator";
import { CsLoaderRegistry } from "@/services/cs-loader-registry";
import { contentScriptGuard } from "@/utils/content-scripts-guard";

$(showInitializingIndicator);

contentScriptGuard();

CsLoaderRegistry.executeAll();

export { default as csUiRootCss } from "@/assets/cs.css?inline";
