import {
  defineManifest as defineChromeManifest,
  ManifestV3Export,
} from "@crxjs/vite-plugin";
import chalk from "chalk";

import packageData from "../package.json";
import { APP_CONFIG } from "./app.config";

type ExtendedManifestV3Export = ManifestV3Export & {
  optional_host_permissions: string[];
};

type MozManifest = ExtendedManifestV3Export & {
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

const defineMozManifest = defineChromeManifest as unknown as (
  manifest: MozManifest,
) => MozManifest;

const browser = APP_CONFIG.BROWSER;

const baseManifest: ExtendedManifestV3Export = {
  manifest_version: 3,
  name: `${APP_CONFIG.IS_DEV ? "[🟡 Dev] " : ""}${
    packageData.displayName || packageData.name
  }`,
  description: packageData.description,
  version: packageData.version,
  homepage_url: "https://cplx.vercel.app",

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
      js: ["src/entrypoints/content-scripts/loader.ts"],
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

function createManifest(): ManifestV3Export | MozManifest {
  console.log("\n", chalk.bold.underline.yellow("TARGET BROWSER:"), browser);

  if (browser === "chrome") {
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

    return defineChromeManifest(chromeManifest);
  } else {
    const mozManifest: MozManifest = {
      ...baseManifest,
      permissions: ["storage", "contextMenus"],
      optional_permissions: ["cookies"],
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

    return defineMozManifest(mozManifest);
  }
}

export default createManifest();
