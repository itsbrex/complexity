import { APP_CONFIG } from "@/app.config";
import { MaybePromise } from "@/types/utils.types";
import { isInContentScript } from "@/utils/utils";

export const LOADER_IDS = [
  "lib:i18next",
  "lib:dayjs",

  "cache:extensionLocalStorage",
  "cache:pluginsStates",
  "cache:languageModels",
  "cache:focusModes",
  "cache:betterCodeBlocksFineGrainedOptions",

  "messaging:namespaceSetup",
  "messaging:networkIntercept",
  "messaging:spaRouter",

  "coreDomObserver:queryBoxes",
  "coreDomObserver:homeComponents",
  "coreDomObserver:threadComponents",

  "networkIntercept:pplxApi",
  "networkIntercept:languageModelSelector",

  "plugins:core",

  "plugin:pplxThemeLoader",

  "plugin:hideGetMobileAppCtaBtn",
  "plugin:zenMode",
  "plugin:blockAnalyticEvents",

  "plugin:thread:canvas:resetOpenStateOnRouteChange",
  "plugin:thread:canvas:codeBlockPlaceholdersData",
  "plugin:thread:dragAndDropFileToUploadInThread",
  "plugin:thread:collapseEmptyThreadVisualCols",
  "plugin:thread:betterMessageToolbars:explicitModelName",
  "plugin:thread:betterMessageToolbars:wordsAndCharactersCount",

  "plugin:queryBox:initSharedStore",
  "plugin:queryBox:focusSelector:networkInterceptMiddleware",
  "plugin:queryBox:promptHistory:networkInterceptMiddleware",
  "plugin:queryBox:promptHistory:listeners",
  "plugin:queryBox:noFileCreationOnPaste",
  "plugin:queryBox:submitOnCtrlEnter",
  "plugin:queryBox:fullWidthFollowUp",
  "plugin:home:customSlogan",

  "store:colorScheme",

  "csui:root",
] as const;

type LoaderId = (typeof LOADER_IDS)[number];

type LoaderDefinition = {
  id: LoaderId;
  loader: () => MaybePromise<void>;
  dependencies?: LoaderId[];
};

export class CsLoaderRegistry {
  private static loaderMap = new Map<LoaderId, LoaderDefinition>();
  private static loadedLoaders = new Set<LoaderId>();
  private static loadingPromises = new Map<LoaderId, Promise<void>>();

  static isLoaderLoaded(loaderId: LoaderId): boolean {
    return CsLoaderRegistry.loadedLoaders.has(loaderId);
  }

  static register(loaderConfig: LoaderDefinition) {
    if (!isInContentScript() && process.env.NODE_ENV !== "test") return;

    if (CsLoaderRegistry.loaderMap.has(loaderConfig.id)) {
      throw new Error(`Loader \`${loaderConfig.id}\` is already registered`);
    }

    CsLoaderRegistry.loaderMap.set(loaderConfig.id, loaderConfig);
  }

  private static async loadLoader(loaderId: LoaderId): Promise<void> {
    if (CsLoaderRegistry.loadedLoaders.has(loaderId)) return;

    const existingPromise = CsLoaderRegistry.loadingPromises.get(loaderId);
    if (existingPromise) {
      return existingPromise;
    }

    const loader = CsLoaderRegistry.loaderMap.get(loaderId);
    if (!loader) {
      throw new Error(`Loader \`${loaderId}\` is not registered`);
    }

    const loadingPromise = (async () => {
      try {
        if (loader.dependencies?.length != null) {
          for (const depId of loader.dependencies) {
            await CsLoaderRegistry.loadLoader(depId);
          }
        }

        await loader.loader();
        CsLoaderRegistry.loadedLoaders.add(loaderId);
      } finally {
        CsLoaderRegistry.loadingPromises.delete(loaderId);
      }
    })();

    CsLoaderRegistry.loadingPromises.set(loaderId, loadingPromise);
    return loadingPromise;
  }

  static async executeAll(): Promise<void> {
    const registeredLoaders = Array.from(CsLoaderRegistry.loaderMap.keys());
    for (const loaderId of registeredLoaders) {
      await CsLoaderRegistry.loadLoader(loaderId);
    }
  }
}

if (APP_CONFIG.IS_DEV && isInContentScript()) {
  setTimeout(() => {
    for (const loaderId of LOADER_IDS) {
      if (!CsLoaderRegistry.isLoaderLoaded(loaderId)) {
        console.warn(
          `[ContentScriptLoaderRegistry] Loader \`${loaderId}\` hasn't loaded after 5 seconds. Ensure the callback from register() is called or the file has inline registration.`,
        );
      }
    }
  }, 5000);
}
