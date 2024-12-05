import { defineManifest } from "@crxjs/vite-plugin";

import { ExtendedManifestV3Export, baseManifest } from "./manifest.base";

export type MozManifest = ExtendedManifestV3Export & {
  browser_specific_settings: {
    gecko: {
      id: string;
      strict_min_version: string;
    };
  };
  background: {
    service_worker?: never;
    type: "classic" | "module";
  };
};

const defineMozManifest = defineManifest as unknown as (
  manifest: MozManifest,
) => MozManifest;

const mozManifest: MozManifest = {
  ...baseManifest,
  permissions: ["storage", "unlimitedStorage", "contextMenus"],
  optional_permissions: [],
  browser_specific_settings: {
    gecko: {
      id: "complexity@ngocdg",
      strict_min_version: "109.0",
    },
  },
  background: {
    scripts: ["src/entrypoints/background/index.ts"],
    type: "module",
  },
} as MozManifest;

export default defineMozManifest(mozManifest);
