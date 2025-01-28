import { getPlatform } from "@/hooks/usePlatformDetection";
import { PluginId } from "@/services/extension-local-storage/plugins.types";

const CORE_PLUGINS = [
  "networkIntercept",
  "spaRouter",
  "webSocket",
  "domObserver",
  "reactVdom",
  "mermaidRenderer",
  "markmapRenderer",
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
  slashCommand: {
    label: "Slash Command",
    description: "Plugins that are enabled by typing a slash command",
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
      "Experimental plugins. Subject to change or removal without prior notice",
  },
  beta: {
    label: "Beta",
    description: "Official plugins but still in testing/development",
  },
  forFun: {
    label: "For Fun",
    description: "Just for fun!",
  },
  new: {
    label: "New",
    description: "Recently added plugins",
  },
} as const;

export type CplxPluginMetadata = Record<
  PluginId,
  {
    id: PluginId;
    routeSegment: string;
    title: string;
    description: React.ReactNode;
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
  "queryBox:focusSelector": {
    id: "queryBox:focusSelector",
    routeSegment: "query-box-focus-selector",
    title: "Better Focus Selector",
    description:
      "Replace the default Perplexity's focus selector with a more customizable one. \nAlso allows you to temporarily switch to writing mode while in web modes",
    tags: ["ui", "ux"],
    dependentCorePlugins: ["spaRouter", "domObserver"],
  },
  "queryBox:focusSelector:webRecency": {
    id: "queryBox:focusSelector:webRecency",
    routeSegment: "query-box-focus-selector-web-recency",
    title: "Web Focus Recency Selector",
    description:
      "Select the recency of the web search from homepage and within threads",
    tags: ["beta", "ui", "ux"],
    dependentPlugins: ["queryBox:focusSelector"],
    dependentCorePlugins: ["spaRouter", "domObserver", "reactVdom"],
  },
  "queryBox:slashCommandMenu": {
    id: "queryBox:slashCommandMenu",
    routeSegment: "query-box-slash-command-menu",
    title: "Slash Command Menu",
    description: "Invoke actions via slash commands",
    tags: ["desktopOnly", "ui", "ux"],
    dependentCorePlugins: ["spaRouter", "domObserver", "networkIntercept"],
  },
  "queryBox:slashCommandMenu:promptHistory": {
    id: "queryBox:slashCommandMenu:promptHistory",
    routeSegment: "query-box-slash-command-menu-prompt-history",
    title: "Prompt History",
    description: "Reuse previous prompts",
    tags: ["experimental", "slashCommand", "desktopOnly", "ui", "ux"],
    dependentPlugins: ["queryBox:slashCommandMenu"],
    dependentCorePlugins: ["spaRouter", "domObserver", "networkIntercept"],
  },
  spaceNavigator: {
    id: "spaceNavigator",
    routeSegment: "space-navigator",
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
      "Prevent automatic file creation when pasting (very) long text into the query box",
    tags: ["ux"],
    dependentCorePlugins: ["spaRouter", "domObserver"],
  },
  "queryBox:submitOnCtrlEnter": {
    id: "queryBox:submitOnCtrlEnter",
    routeSegment: "query-box-submit-on-ctrl-enter",
    title: `Query Box: Submit on ${getPlatform() === "mac" ? "Cmd" : "Ctrl"}+Enter`,
    description: `Insert new line on Enter, submit on ${getPlatform() === "mac" ? "Cmd" : "Ctrl"}+Enter`,
    tags: ["ux"],
    dependentCorePlugins: ["spaRouter", "domObserver"],
  },
  "queryBox:fullWidthFollowUp": {
    id: "queryBox:fullWidthFollowUp",
    routeSegment: "query-box-full-width-follow-up",
    title: "Full Width Follow Up Query Box",
    description: "Make the query box in threads wider",
    tags: ["desktopOnly", "ui"],
    dependentCorePlugins: ["spaRouter"],
  },
  commandMenu: {
    id: "commandMenu",
    routeSegment: "command-menu",
    title: "Command Menu",
    description: "Quickly navigate around and invoke actions",
    tags: ["ui", "ux", "desktopOnly"],
    dependentCorePlugins: ["spaRouter", "webSocket"],
  },
  "thread:toc": {
    id: "thread:toc",
    routeSegment: "thread-toc",
    title: "Thread ToC",
    description:
      "Quickly navigate between messages in a thread. Only shows up when there are more than 2 messages",
    tags: ["ui", "ux"],
    dependentCorePlugins: ["spaRouter", "domObserver"],
  },
  "thread:betterMessageToolbars": {
    id: "thread:betterMessageToolbars",
    routeSegment: "thread-better-message-toolbars",
    title: "Better Thread Message Toolbars",
    description: "Enhance message toolbars (in threads)",
    tags: ["ui", "ux"],
    dependentCorePlugins: ["spaRouter", "domObserver", "reactVdom"],
  },
  "thread:betterCodeBlocks": {
    id: "thread:betterCodeBlocks",
    routeSegment: "thread-better-code-blocks",
    title: "Better Code Blocks",
    description: "Enhance code blocks (in threads)",
    tags: ["ui", "ux"],
    dependentCorePlugins: ["spaRouter", "domObserver", "reactVdom"],
  },
  "thread:canvas": {
    id: "thread:canvas",
    routeSegment: "thread-canvas",
    title: "Canvas",
    description:
      "Visualize and interact with generated content side by side. Similar to claude.ai's artifacts. Very experimental",
    tags: ["new", "experimental", "desktopOnly", "ui"],
    dependentPlugins: ["thread:betterCodeBlocks"],
    dependentCorePlugins: [
      "spaRouter",
      "domObserver",
      "mermaidRenderer",
      "markmapRenderer",
    ],
  },
  "thread:exportThread": {
    id: "thread:exportThread",
    routeSegment: "thread-export-thread",
    title: "Export Thread",
    description:
      "Export the current thread in markdown format (with optional citations). More formatting options coming soon",
    tags: ["ui", "ux"],
    dependentCorePlugins: ["spaRouter"],
  },
  "thread:betterMessageCopyButtons": {
    id: "thread:betterMessageCopyButtons",
    routeSegment: "thread-better-message-copy-buttons",
    title: "Better Thread Message Copy Buttons",
    description:
      "Copy message content without citations. More formatting options coming soon",
    tags: ["ui", "ux"],
    dependentCorePlugins: ["spaRouter", "domObserver"],
  },
  "thread:dragAndDropFileToUploadInThread": {
    id: "thread:dragAndDropFileToUploadInThread",
    routeSegment: "thread-drag-and-drop-file-to-upload-in-thread",
    title: "Drag and Drop File(s) to Upload in a thread",
    description:
      "Treat the whole thread page as a drop zone and allow you to directly drag & drop file(s) to upload them as attachment(s)",
    tags: ["ux", "desktopOnly"],
    dependentCorePlugins: ["spaRouter"],
  },
  "thread:collapseEmptyThreadVisualCols": {
    id: "thread:collapseEmptyThreadVisualCols",
    routeSegment: "thread-collapse-empty-thread-visual-cols",
    title: "Collapse Empty Thread Visual Columns",
    description: "Collapse empty visual columns in the thread page",
    tags: ["ui", "desktopOnly"],
    dependentCorePlugins: ["spaRouter"],
  },
  "thread:customThreadContainerWidth": {
    id: "thread:customThreadContainerWidth",
    routeSegment: "thread-custom-thread-container-width",
    title: "Custom Thread Container Width",
    description: "Customize the maximum width of the thread container",
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
      "Prevent Perplexity from sending analytic/tracking events. For debugging purposes only",
    tags: ["privacy"],
    dependentCorePlugins: ["networkIntercept"],
  },
  "home:customSlogan": {
    id: "home:customSlogan",
    routeSegment: "home-custom-slogan",
    title: "Custom Home Slogan",
    description: "Customize the slogan on the home page",
    tags: ["ui", "forFun"],
  },
  "hide-get-mobile-app-cta-btn": {
    id: "hide-get-mobile-app-cta-btn",
    routeSegment: "hide-get-mobile-app-cta-btn",
    title: 'Hide "Get Mobile App" Button',
    description: 'Hide all "Get Mobile App" buttons on mobile screens',
    tags: ["ui"],
  },
  zenMode: {
    id: "zenMode",
    routeSegment: "zen-mode",
    title: "Zen Mode",
    description:
      "Hide elements on the page to focus on the content (toggleable). Enable via the Command Menu plugin.",
    tags: ["ui", "desktopOnly"],
    dependentCorePlugins: ["spaRouter", "domObserver"],
    dependentPlugins: ["commandMenu"],
  },
};
