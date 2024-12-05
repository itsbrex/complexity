import { ManifestV3Export } from "@crxjs/vite-plugin";

import { APP_CONFIG } from "./app.config";
import packageData from ".././package.json";

export type ExtendedManifestV3Export = ManifestV3Export & {
  optional_host_permissions: string[];
};

export const baseManifest: ExtendedManifestV3Export = {
  manifest_version: 3,
  name: `${APP_CONFIG.IS_DEV ? "[🟡 Dev] " : ""}${
    packageData.displayName || packageData.name
  }`,
  description: packageData.description,
  version: packageData.version,
  homepage_url: "https://cplx.app",

  icons: {
    16: "public/img/logo-16.png",
    32: "public/img/logo-34.png",
    48: "public/img/logo-48.png",
    128: "public/img/logo-128.png",
  },
  action: {
    default_icon: "public/img/logo-48.png",
  },
  options_ui: {
    open_in_tab: true,
    page: "src/entrypoints/options.html",
  },

  host_permissions: APP_CONFIG["perplexity-ai"].globalMatches,
  optional_host_permissions: ["https://*/*"],

  content_scripts: [
    {
      matches: APP_CONFIG["perplexity-ai"].globalMatches,
      exclude_matches: APP_CONFIG["perplexity-ai"].globalExcludeMatches,
      js: ["src/entrypoints/content-scripts/index.ts"],
      run_at: "document_start",
    },
  ],

  web_accessible_resources: [
    {
      resources: ["public/img/logo-*.png"],
      matches: ["*://*/*"],
    },
  ],
};
