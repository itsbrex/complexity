import { getPlatform } from "@/hooks/usePlatformDetection";
import { ExtensionLocalStorage } from "@/services/extension-local-storage/extension-local-storage.types";
import packageJson from "~/package.json";

export const DEFAULT_STORAGE: ExtensionLocalStorage = {
  schemaVersion: packageJson.version,
  plugins: {
    "queryBox:languageModelSelector": {
      enabled: false,
      main: true,
      followUp: true,
      changeTimezone: false,
    },
    "queryBox:fullWidthFollowUp": {
      enabled: false,
    },
    "queryBox:focusSelector": {
      enabled: false,
      mode: "persistent",
      defaultFocusMode: "internet",
    },
    "queryBox:focusSelector:webRecency": {
      enabled: false,
    },
    "queryBox:spaceNavigator": {
      enabled: false,
    },
    "queryBox:slashCommandMenu:promptHistory": {
      enabled: false,
      trigger: {
        onSubmit: true,
        onNavigation: true,
      },
      showTriggerButton: true,
    },
    "queryBox:noFileCreationOnPaste": {
      enabled: false,
    },
    "queryBox:submitOnCtrlEnter": {
      enabled: false,
    },
    commandMenu: {
      hotkey: [
        getPlatform() === "mac" ? Key.Meta : Key.Control,
        getPlatform() === "mac" ? "i" : "k",
      ],
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
      wordsAndCharactersCount: true,
      tokensCount: false,
    },
    "thread:betterCodeBlocks": {
      enabled: false,
      stickyHeader: true,
      unwrap: {
        enabled: true,
        showToggleButton: true,
      },
      maxHeight: {
        enabled: true,
        collapseByDefault: false,
        value: 500,
        showToggleButton: true,
      },
    },
    "thread:canvas": {
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
    "thread:customThreadContainerWidth": {
      enabled: false,
      value: 1100,
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
    zenMode: {
      enabled: false,
      persistent: false,
      lastState: false,
      alwaysHideRelatedQuestions: false,
      alwaysHideVisualCols: false,
    },
  },
  favoritePluginIds: [],
  preloadTheme: false,
  theme: "complexity",
  energySavingMode: false,
  extensionIconAction: "perplexity",
  cdnLastUpdated: 0,
  devMode: false,
} as const;
