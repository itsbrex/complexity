import { defineManifest, ManifestV3Export } from "@crxjs/vite-plugin";

import { baseManifest } from "./manifest.base";

const chromeManifest = {
  ...baseManifest,
  permissions: ["storage"],
  optional_permissions: ["cookies", "contextMenus"],
  background: {
    service_worker: "src/entrypoints/background/index.ts",
    type: "module",
  },
  minimum_chrome_version: "89",
} as ManifestV3Export;

export default defineManifest(chromeManifest);
