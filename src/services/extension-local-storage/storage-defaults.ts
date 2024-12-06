import { ExtensionLocalStorage } from "@/services/extension-local-storage/extension-local-storage.types";
import packageJson from "~/package.json";

export const DEFAULT_STORAGE: ExtensionLocalStorage = {
  schemaVersion: packageJson.version,
  plugins: {
    "queryBox:languageModelSelector": {
      enabled: false,
      main: true,
      followUp: {
        enabled: true,
        span: true,
      },
    },
    "queryBox:spaceNavigator": {
      enabled: false,
    },
    "queryBox:noFileCreationOnPaste": {
      enabled: false,
    },
    commandMenu: {
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
    "thread:betterCodeBlocks:previewMermaid": {
      enabled: false,
    },
    "thread:exportThread": {
      enabled: false,
    },
    "thread:betterMessageCopyButtons": {
      enabled: false,
    },
    "thread:dragAndDropFileToUploadInThread": {
      enabled: false,
    },
    "thread:collapseEmptyThreadVisualCols": {
      enabled: false,
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
    "home:customSlogan": {
      enabled: false,
      slogan: "",
    },
    "hide-get-mobile-app-cta-btn": {
      enabled: false,
    },
  },
  favoritePluginIds: [],
  theme: "complexity",
  energySavingMode: false,
} as const;
