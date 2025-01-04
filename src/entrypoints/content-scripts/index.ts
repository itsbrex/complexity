import "@/utils/jquery.extensions";

import { CsLoaderRegistry } from "@/services/cs-loader-registry";
import { contentScriptGuard } from "@/utils/content-scripts-guard";
import "@/entrypoints/content-scripts/loaders";

contentScriptGuard();

CsLoaderRegistry.executeAll();
