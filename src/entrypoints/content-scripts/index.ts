import "@/utils/jquery.extensions";

import { contentScriptGuard } from "@/utils/content-scripts-guard";

contentScriptGuard();

import("@/entrypoints/content-scripts/loaders");
