import { z } from "zod";

import { BetterCodeBlockGlobalOptionsSchema } from "@/data/dashboard/better-code-blocks/better-code-blocks-options.types";
import { FocusMode } from "@/data/plugins/focus-selector/focus-modes";

export const PluginSettingsSchema = z.object({
  enabled: z.boolean(),
});

export type PluginSettings = z.infer<typeof PluginSettingsSchema>;

export const PluginsSchema = z.object({
  "queryBox:languageModelSelector": PluginSettingsSchema.extend({
    main: z.boolean(),
    followUp: z.boolean(),
  }),
  "queryBox:fullWidthFollowUp": PluginSettingsSchema,
  "queryBox:focusSelector": PluginSettingsSchema.extend({
    mode: z.enum(["persistent", "default"]).nullable(),
    defaultFocusMode: z
      .string()
      .transform((val) => val as FocusMode["code"])
      .nullable(),
  }),
  "queryBox:focusSelector:webRecency": PluginSettingsSchema,
  "queryBox:spaceNavigator": PluginSettingsSchema,
  "queryBox:slashCommandMenu:promptHistory": PluginSettingsSchema.extend({
    trigger: z.object({
      onSubmit: z.boolean(),
      onNavigation: z.boolean(),
    }),
    showTriggerButton: z.boolean(),
  }),
  "queryBox:noFileCreationOnPaste": PluginSettingsSchema,
  commandMenu: PluginSettingsSchema.extend({
    hotkey: z.array(z.string()),
  }),
  "queryBox:submitOnCtrlEnter": PluginSettingsSchema,
  "thread:toc": PluginSettingsSchema,
  "thread:betterMessageToolbars": PluginSettingsSchema.extend({
    sticky: z.boolean(),
    simplifyRewriteDropdown: z.boolean(),
    explicitModelName: z.boolean(),
    hideUnnecessaryButtons: z.boolean(),
    wordsAndCharactersCount: z.boolean(),
    tokensCount: z.boolean(),
  }),
  "thread:betterCodeBlocks": PluginSettingsSchema.merge(
    BetterCodeBlockGlobalOptionsSchema,
  ),
  "thread:canvas": PluginSettingsSchema,
  "thread:exportThread": PluginSettingsSchema,
  "thread:betterMessageCopyButtons": PluginSettingsSchema,
  "thread:dragAndDropFileToUploadInThread": PluginSettingsSchema,
  "thread:collapseEmptyThreadVisualCols": PluginSettingsSchema,
  imageGenModelSelector: PluginSettingsSchema,
  onCloudflareTimeoutAutoReload: PluginSettingsSchema.extend({
    behavior: z.enum(["reload", "warn-only"]),
  }),
  "thread:customThreadContainerWidth": PluginSettingsSchema.extend({
    value: z.number(),
  }),
  blockAnalyticEvents: PluginSettingsSchema,
  "home:customSlogan": PluginSettingsSchema.extend({
    slogan: z.string(),
  }),
  "hide-get-mobile-app-cta-btn": PluginSettingsSchema,
  zenMode: PluginSettingsSchema.extend({
    persistent: z.boolean(),
    lastState: z.boolean(),
    alwaysHideRelatedQuestions: z.boolean(),
    alwaysHideVisualCols: z.boolean(),
  }),
});

export type Plugins = z.infer<typeof PluginsSchema>;
export type PluginId = keyof Plugins;

export function isPluginId(value: string): value is PluginId {
  return Object.keys(PluginsSchema.shape).includes(value);
}
