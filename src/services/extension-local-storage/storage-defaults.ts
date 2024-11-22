import { ExtensionLocalStorage } from "@/services/extension-local-storage/extension-local-storage.types";
import packageJson from "~/package.json";

export const DEFAULT_STORAGE: ExtensionLocalStorage = {
  schemaVersion: packageJson.version,
  plugins: {
    "queryBox:languageModelSelector": {
      enabled: false,
      main: true,
      followUp: true,
    },
    "queryBox:noFileCreationOnPaste": {
      enabled: false,
    },
    "thread:toc": {
      enabled: false,
    },
    "thread:betterMessageToolbars": {
      enabled: false,
      sticky: true,
      simplifyRewriteDropdown: true,
      explicitModelName: true,
      hideUnnecessaryButtons: true,
    },
    "thread:betterCodeBlocks": {
      enabled: false,
      stickyHeader: true,
      theme: {
        enabled: true,
        light: "light-plus",
        dark: "dark-plus",
      },
      unwrap: {
        enabled: true,
        showToggleButton: true,
      },
      maxHeight: {
        enabled: true,
        value: 500,
        showToggleButton: true,
      },
    },
    imageGenModelSelector: {
      enabled: false,
    },
    onCloudflareTimeoutAutoReload: {
      enabled: false,
      behavior: "reload",
    },
    blockAnalyticEvents: {
      enabled: false,
    },
    dragAndDropFileToUploadInThread: {
      enabled: false,
    },
    collapseEmptyThreadVisualCols: {
      enabled: false,
    },
  },
  favoritePluginIds: [],
} as const;
