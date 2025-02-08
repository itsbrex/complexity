export const CALLBACK_QUEUE_TASK_IDS = [
  "home",
  "home:slogan",
  "home:bottomBar",
  "home:languageSelector",

  "sidebar:wrapper",
  "sidebar:spaceButtonWrapper",
  "sidebar:libraryButtonWrapper",

  "queryBoxes",
  "queryBoxes:home",
  "queryBoxes:collection",
  "queryBoxes:followUp",
  "queryBoxes:modal",

  "thread",
  "thread:navbar",
  "thread:wrapper",
  "thread:popper",
  "thread:messageBlocks",
  "thread:codeBlocks",
  "thread:tocSidebarObserver",

  "spacesPage:spaceCard",

  "settingsPage:topNavWrapper",

  "plugin:instantRewriteButton:handleInstantRewrite",
] as const;

export type CallbackQueueTaskId = (typeof CALLBACK_QUEUE_TASK_IDS)[number];
