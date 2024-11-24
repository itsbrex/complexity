import { PluginId } from "@/services/extension-local-storage/plugins.types";

const CORE_PLUGINS = [
  "networkIntercept",
  "spaRouter",
  "webSocket",
  "domObserver",
  "reactVdom",
  "codeHighlighter",
] as const;

export type CorePluginId = (typeof CORE_PLUGINS)[number];

export type PluginTagValues = keyof typeof PLUGIN_TAGS;

export const PLUGIN_TAGS = {
  ui: {
    label: "Appearance",
    description: "UI related plugins",
  },
  ux: {
    label: "Ease of Use",
    description: "UX related plugins",
  },
  desktopOnly: {
    label: "Desktop Only",
    description: "Can only be used on desktop/screen width > 768px",
  },
  privacy: {
    label: "Privacy",
    description: "Privacy related plugins",
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
  }
>;

export const PLUGINS_METADATA: CplxPluginMetadata = {
  "queryBox:languageModelSelector": {
    id: "queryBox:languageModelSelector",
    routeSegment: "query-box-language-model-selector",
    title: "Language Model Selector",
    description: "Enable selection of different language models",
    tags: ["ui", "ux"],
    dependentCorePlugins: ["networkIntercept", "spaRouter", "domObserver"],
  },
  "queryBox:noFileCreationOnPaste": {
    id: "queryBox:noFileCreationOnPaste",
    routeSegment: "query-box-no-file-creation-on-paste",
    title: "Prevent File Creation on Paste",
    description:
      "Prevent automatic file creation when pasting (very) long text into the query box.",
    tags: ["ux"],
    dependentCorePlugins: ["spaRouter", "domObserver"],
  },
  "thread:toc": {
    id: "thread:toc",
    routeSegment: "thread-toc",
    title: "Thread ToC",
    description:
      "Add a table of contents to the thread page with >= 2 messages.",
    tags: ["ui", "ux"],
    dependentCorePlugins: ["spaRouter", "domObserver"],
  },
  "thread:betterMessageToolbars": {
    id: "thread:betterMessageToolbars",
    routeSegment: "thread-better-message-toolbars",
    title: "Better Thread Message Toolbars",
    description: "Enhance message toolbars (in threads).",
    tags: ["ui", "ux"],
    dependentCorePlugins: ["spaRouter", "domObserver", "reactVdom"],
  },
  "thread:betterCodeBlocks": {
    id: "thread:betterCodeBlocks",
    routeSegment: "thread-better-code-blocks",
    title: "Better Code Blocks",
    description: "Enhance code blocks (in threads).",
    tags: ["ui", "ux"],
    dependentCorePlugins: [
      "spaRouter",
      "domObserver",
      "reactVdom",
      "codeHighlighter",
    ],
  },
  "thread:betterMessageCopyButtons": {
    id: "thread:betterMessageCopyButtons",
    routeSegment: "thread-better-message-copy-buttons",
    title: "Better Thread Message Copy Buttons",
    description:
      "Enable you to copy message content without citations. Possibly more customization options in the future.",
    tags: ["ui", "ux"],
    dependentCorePlugins: ["spaRouter", "domObserver", "reactVdom"],
  },
  imageGenModelSelector: {
    id: "imageGenModelSelector",
    routeSegment: "image-gen-model-selector",
    title: "Image Generation Model Selector",
    description: "Enable selection of different image generation models",
    tags: ["ui", "ux", "desktopOnly"],
    dependentCorePlugins: ["networkIntercept", "spaRouter", "domObserver"],
  },
  onCloudflareTimeoutAutoReload: {
    id: "onCloudflareTimeoutAutoReload",
    routeSegment: "on-cloudflare-timeout-auto-reload",
    title: "Auto Reload on Cloudflare Timeout",
    description: "Auto reload the page on Cloudflare timeout",
    tags: ["ux"],
  },
  blockAnalyticEvents: {
    id: "blockAnalyticEvents",
    routeSegment: "block-analytic-events",
    title: "Block Analytic Events",
    description:
      "Prevent Perplexity from sending useless analytic/tracking events. Might save you some bandwidth 😉.",
    tags: ["privacy"],
    dependentCorePlugins: ["networkIntercept"],
  },
  dragAndDropFileToUploadInThread: {
    id: "dragAndDropFileToUploadInThread",
    routeSegment: "drag-and-drop-file-to-upload-in-thread",
    title: "Drag and Drop File(s) to Upload in a thread",
    description:
      "Treat the whole thread page as a drop zone and allow you to directly drag & drop file(s) to upload them as attachment(s).",
    tags: ["ux", "desktopOnly"],
    dependentCorePlugins: ["spaRouter"],
  },
  collapseEmptyThreadVisualCols: {
    id: "collapseEmptyThreadVisualCols",
    routeSegment: "collapse-empty-thread-visual-cols",
    title: "Collapse Empty Thread Visual Columns",
    description: "Collapse empty visual columns in the thread page.",
    tags: ["ui", "desktopOnly"],
    dependentCorePlugins: ["spaRouter"],
  },
};
