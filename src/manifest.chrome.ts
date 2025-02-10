import { defineManifest } from "@crxjs/vite-plugin";
import { baseManifest, ExtendedManifestV3Export } from "./manifest.base";
import { produce } from "immer";

export default defineManifest(
  produce(baseManifest as ExtendedManifestV3Export, (draft) => {
    draft.permissions = ["storage", "unlimitedStorage", "contextMenus"];
    draft.optional_permissions = ["scripting", "webNavigation"];
    draft.background = {
      service_worker: "src/entrypoints/background/index.ts",
      type: "module",
    };
    draft.content_scripts![0]!.run_at = "document_start";
  }),
);
