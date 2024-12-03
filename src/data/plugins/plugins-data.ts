import { PluginId } from "@/services/extension-local-storage/plugins.types";

const CORE_PLUGINS = [
  "networkIntercept",
  "spaRouter",
  "webSocket",
  "domObserver",
  "reactVdom",
  "codeHighlighter",
  "mermaidRenderer",
] as const;

export type CorePluginId = (typeof CORE_PLUGINS)[number];

export type PluginTagValues = keyof typeof PLUGIN_TAGS;

export const PLUGIN_TAGS = {
  ui: {
    label: t("dashboard-plugins-data:pluginTags.ui.label"),
    description: t("dashboard-plugins-data:pluginTags.ui.description"),
  },
  ux: {
    label: t("dashboard-plugins-data:pluginTags.ux.label"),
    description: t("dashboard-plugins-data:pluginTags.ux.description"),
  },
  desktopOnly: {
    label: t("dashboard-plugins-data:pluginTags.desktopOnly.label"),
    description: t("dashboard-plugins-data:pluginTags.desktopOnly.description"),
  },
  privacy: {
    label: t("dashboard-plugins-data:pluginTags.privacy.label"),
    description: t("dashboard-plugins-data:pluginTags.privacy.description"),
  },
  pplxPro: {
    label: t("dashboard-plugins-data:pluginTags.pplxPro.label"),
    description: t("dashboard-plugins-data:pluginTags.pplxPro.description"),
  },
  experimental: {
    label: t("dashboard-plugins-data:pluginTags.experimental.label"),
    description: t(
      "dashboard-plugins-data:pluginTags.experimental.description",
    ),
  },
  beta: {
    label: t("dashboard-plugins-data:pluginTags.beta.label"),
    description: t("dashboard-plugins-data:pluginTags.beta.description"),
  },
  forFun: {
    label: t("dashboard-plugins-data:pluginTags.forFun.label"),
    description: t("dashboard-plugins-data:pluginTags.forFun.description"),
  },
} as const;

export type CplxPluginMetadata = Record<
  PluginId,
  {
    id: PluginId;
    routeSegment: string;
    title: string;
    description: string;
    tags?: PluginTagValues[];
    dependentCorePlugins?: CorePluginId[];
    dependentPlugins?: PluginId[];
  }
>;

export const PLUGINS_METADATA: CplxPluginMetadata = {
  "queryBox:languageModelSelector": {
    id: "queryBox:languageModelSelector",
    routeSegment: "query-box-language-model-selector",
    title: t(
      "dashboard-plugins-data:pluginsMetadata.queryboxLanguageModelSelector.title",
    ),
    description: t(
      "dashboard-plugins-data:pluginsMetadata.queryboxLanguageModelSelector.description",
    ),
    tags: ["ui", "ux", "pplxPro"],
    dependentCorePlugins: ["networkIntercept", "spaRouter", "domObserver"],
  },
  "queryBox:noFileCreationOnPaste": {
    id: "queryBox:noFileCreationOnPaste",
    routeSegment: "query-box-no-file-creation-on-paste",
    title: t(
      "dashboard-plugins-data:pluginsMetadata.queryboxNoFileCreationOnPaste.title",
    ),
    description: t(
      "dashboard-plugins-data:pluginsMetadata.queryboxNoFileCreationOnPaste.description",
    ),
    tags: ["ux"],
    dependentCorePlugins: ["spaRouter", "domObserver"],
  },
  commandMenu: {
    id: "commandMenu",
    routeSegment: "command-menu",
    title: t("dashboard-plugins-data:pluginsMetadata.commandMenu.title"),
    description: t(
      "dashboard-plugins-data:pluginsMetadata.commandMenu.description",
    ),
    tags: ["experimental", "ui", "ux", "desktopOnly"],
    dependentCorePlugins: ["spaRouter", "webSocket"],
  },
  "thread:toc": {
    id: "thread:toc",
    routeSegment: "thread-toc",
    title: t("dashboard-plugins-data:pluginsMetadata.threadToc.title"),
    description: t(
      "dashboard-plugins-data:pluginsMetadata.threadToc.description",
    ),
    tags: ["ui", "ux"],
    dependentCorePlugins: ["spaRouter", "domObserver"],
  },
  "thread:betterMessageToolbars": {
    id: "thread:betterMessageToolbars",
    routeSegment: "thread-better-message-toolbars",
    title: t(
      "dashboard-plugins-data:pluginsMetadata.threadBetterMessageToolbars.title",
    ),
    description: t(
      "dashboard-plugins-data:pluginsMetadata.threadBetterMessageToolbars.description",
    ),
    tags: ["ui", "ux"],
    dependentCorePlugins: ["spaRouter", "domObserver", "reactVdom"],
  },
  "thread:betterCodeBlocks": {
    id: "thread:betterCodeBlocks",
    routeSegment: "thread-better-code-blocks",
    title: t(
      "dashboard-plugins-data:pluginsMetadata.threadBetterCodeBlocks.title",
    ),
    description: t(
      "dashboard-plugins-data:pluginsMetadata.threadBetterCodeBlocks.description",
    ),
    tags: ["ui", "ux"],
    dependentCorePlugins: [
      "spaRouter",
      "domObserver",
      "reactVdom",
      "codeHighlighter",
    ],
  },
  "thread:betterCodeBlocks:previewMermaid": {
    id: "thread:betterCodeBlocks:previewMermaid",
    routeSegment: "thread-better-code-blocks-preview-mermaid",
    title: t(
      "dashboard-plugins-data:pluginsMetadata.threadBetterCodeBlocksPreviewMermaid.title",
    ),
    description: t(
      "dashboard-plugins-data:pluginsMetadata.threadBetterCodeBlocksPreviewMermaid.description",
    ),
    tags: ["ui"],
    dependentCorePlugins: ["mermaidRenderer"],
    dependentPlugins: ["thread:betterCodeBlocks"],
  },
  "thread:exportThread": {
    id: "thread:exportThread",
    routeSegment: "thread-export-thread",
    title: t("dashboard-plugins-data:pluginsMetadata.threadExportThread.title"),
    description: t(
      "dashboard-plugins-data:pluginsMetadata.threadExportThread.description",
    ),
    tags: ["ui", "ux"],
    dependentCorePlugins: ["spaRouter"],
  },
  "thread:betterMessageCopyButtons": {
    id: "thread:betterMessageCopyButtons",
    routeSegment: "thread-better-message-copy-buttons",
    title: t(
      "dashboard-plugins-data:pluginsMetadata.threadBetterMessageCopyButtons.title",
    ),
    description: t(
      "dashboard-plugins-data:pluginsMetadata.threadBetterMessageCopyButtons.description",
    ),
    tags: ["ui", "ux"],
    dependentCorePlugins: ["spaRouter", "domObserver"],
  },
  "thread:dragAndDropFileToUploadInThread": {
    id: "thread:dragAndDropFileToUploadInThread",
    routeSegment: "thread-drag-and-drop-file-to-upload-in-thread",
    title: t(
      "dashboard-plugins-data:pluginsMetadata.threadDragAndDropFileToUploadInThread.title",
    ),
    description: t(
      "dashboard-plugins-data:pluginsMetadata.threadDragAndDropFileToUploadInThread.description",
    ),
    tags: ["ux", "desktopOnly"],
    dependentCorePlugins: ["spaRouter"],
  },
  "thread:collapseEmptyThreadVisualCols": {
    id: "thread:collapseEmptyThreadVisualCols",
    routeSegment: "thread-collapse-empty-thread-visual-cols",
    title: t(
      "dashboard-plugins-data:pluginsMetadata.threadCollapseEmptyThreadVisualCols.title",
    ),
    description: t(
      "dashboard-plugins-data:pluginsMetadata.threadCollapseEmptyThreadVisualCols.description",
    ),
    tags: ["ui", "desktopOnly"],
    dependentCorePlugins: ["spaRouter"],
  },
  imageGenModelSelector: {
    id: "imageGenModelSelector",
    routeSegment: "image-gen-model-selector",
    title: t(
      "dashboard-plugins-data:pluginsMetadata.imageGenModelSelector.title",
    ),
    description: t(
      "dashboard-plugins-data:pluginsMetadata.imageGenModelSelector.description",
    ),
    tags: ["ui", "ux", "desktopOnly", "pplxPro"],
    dependentCorePlugins: ["networkIntercept", "spaRouter", "domObserver"],
  },
  onCloudflareTimeoutAutoReload: {
    id: "onCloudflareTimeoutAutoReload",
    routeSegment: "on-cloudflare-timeout-auto-reload",
    title: t(
      "dashboard-plugins-data:pluginsMetadata.onCloudflareTimeoutAutoReload.title",
    ),
    description: t(
      "dashboard-plugins-data:pluginsMetadata.onCloudflareTimeoutAutoReload.description",
    ),
    tags: ["ux"],
  },
  blockAnalyticEvents: {
    id: "blockAnalyticEvents",
    routeSegment: "block-analytic-events",
    title: t(
      "dashboard-plugins-data:pluginsMetadata.blockAnalyticEvents.title",
    ),
    description: t(
      "dashboard-plugins-data:pluginsMetadata.blockAnalyticEvents.description",
    ),
    tags: ["privacy"],
    dependentCorePlugins: ["networkIntercept"],
  },
  "home:customSlogan": {
    id: "home:customSlogan",
    routeSegment: "home-custom-slogan",
    title: t("dashboard-plugins-data:pluginsMetadata.homeCustomSlogan.title"),
    description: t(
      "dashboard-plugins-data:pluginsMetadata.homeCustomSlogan.description",
    ),
    tags: ["ui", "forFun"],
  },
};
