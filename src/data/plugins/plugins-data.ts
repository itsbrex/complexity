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
  pplxPro: {
    label: "Perplexity Pro",
    description: "Requires an active Perplexity Pro subscription",
  },
  experimental: {
    label: "Experimental",
    description:
      "Experimental plugins. Subject to change or removal without prior notice.",
  },
  beta: {
    label: "Beta",
    description: "Beta plugins",
  },
  forFun: {
    label: "For Fun",
    description: "Just for fun!",
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
    title: "Language Model Selector",
    description: "Enable selection of different language models",
    tags: ["ui", "ux", "pplxPro"],
    dependentCorePlugins: ["networkIntercept", "spaRouter", "domObserver"],
  },
  "queryBox:spaceNavigator": {
    id: "queryBox:spaceNavigator",
    routeSegment: "query-box-space-navigator",
    title: "Space Navigator",
    description: "Search & navigate between spaces",
    tags: ["ui", "ux"],
    dependentCorePlugins: ["spaRouter", "domObserver"],
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
  commandMenu: {
    id: "commandMenu",
    routeSegment: "command-menu",
    title: "Command Menu",
    description: "Quickly navigate around and invoke actions.",
    tags: ["experimental", "ui", "ux", "desktopOnly"],
    dependentCorePlugins: ["spaRouter", "webSocket"],
  },
  "thread:toc": {
    id: "thread:toc",
    routeSegment: "thread-toc",
    title: "Thread ToC",
    description:
      "Quickly navigate between messages in a thread. Only shows up when there are more than 2 messages.",
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
  "thread:betterCodeBlocks:previewMermaid": {
    id: "thread:betterCodeBlocks:previewMermaid",
    routeSegment: "thread-better-code-blocks-preview-mermaid",
    title: "Mermaid Code Blocks Preview",
    description:
      "Preview mermaid diagrams, simple charts, etc. in code blocks.",
    tags: ["ui"],
    dependentCorePlugins: ["mermaidRenderer"],
    dependentPlugins: ["thread:betterCodeBlocks"],
  },
  "thread:exportThread": {
    id: "thread:exportThread",
    routeSegment: "thread-export-thread",
    title: "Export Thread",
    description:
      "Export the current thread in markdown format (with optional citations). More formatting options coming soon.",
    tags: ["ui", "ux"],
    dependentCorePlugins: ["spaRouter"],
  },
  "thread:betterMessageCopyButtons": {
    id: "thread:betterMessageCopyButtons",
    routeSegment: "thread-better-message-copy-buttons",
    title: "Better Thread Message Copy Buttons",
    description:
      "Copy message content without citations. More formatting options coming soon.",
    tags: ["ui", "ux"],
    dependentCorePlugins: ["spaRouter", "domObserver"],
  },
  "thread:dragAndDropFileToUploadInThread": {
    id: "thread:dragAndDropFileToUploadInThread",
    routeSegment: "thread-drag-and-drop-file-to-upload-in-thread",
    title: "Drag and Drop File(s) to Upload in a thread",
    description:
      "Treat the whole thread page as a drop zone and allow you to directly drag & drop file(s) to upload them as attachment(s).",
    tags: ["ux", "desktopOnly"],
    dependentCorePlugins: ["spaRouter"],
  },
  "thread:collapseEmptyThreadVisualCols": {
    id: "thread:collapseEmptyThreadVisualCols",
    routeSegment: "thread-collapse-empty-thread-visual-cols",
    title: "Collapse Empty Thread Visual Columns",
    description: "Collapse empty visual columns in the thread page.",
    tags: ["ui", "desktopOnly"],
    dependentCorePlugins: ["spaRouter"],
  },
  imageGenModelSelector: {
    id: "imageGenModelSelector",
    routeSegment: "image-gen-model-selector",
    title: "Image Generation Model Selector",
    description: "Enable selection of different image generation models",
    tags: ["ui", "ux", "desktopOnly", "pplxPro"],
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
      "Prevent Perplexity from sending analytic/tracking events. For debugging purposes only.",
    tags: ["privacy"],
    dependentCorePlugins: ["networkIntercept"],
  },
  "home:customSlogan": {
    id: "home:customSlogan",
    routeSegment: "home-custom-slogan",
    title: "Custom Home Slogan",
    description: "Customize the slogan on the home page.",
    tags: ["ui", "forFun"],
  },
  "hide-get-mobile-app-cta-btn": {
    id: "hide-get-mobile-app-cta-btn",
    routeSegment: "hide-get-mobile-app-cta-btn",
    title: 'Hide "Get Mobile App" Button',
    description: 'Hide all "Get Mobile App" buttons on mobile screens.',
    tags: ["ui"],
  },
};
