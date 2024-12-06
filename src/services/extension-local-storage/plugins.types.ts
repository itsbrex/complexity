import { z } from "zod";

import { BetterCodeBlockGlobalOptionsSchema } from "@/data/dashboard/better-code-blocks/better-code-blocks-options.types";

export const PluginSettingsSchema = z.object({
  enabled: z.boolean(),
});

export type PluginSettings = z.infer<typeof PluginSettingsSchema>;

export const PluginsSchema = z.object({
  "queryBox:languageModelSelector": PluginSettingsSchema.extend({
    main: z.boolean(),
    followUp: z.object({
      enabled: z.boolean(),
      span: z.boolean(),
    }),
  }),
  "queryBox:spaceNavigator": PluginSettingsSchema,
  "queryBox:noFileCreationOnPaste": PluginSettingsSchema,
  commandMenu: PluginSettingsSchema,
  "thread:toc": PluginSettingsSchema,
  "thread:betterMessageToolbars": PluginSettingsSchema.extend({
    sticky: z.boolean(),
    simplifyRewriteDropdown: z.boolean(),
    explicitModelName: z.boolean(),
    hideUnnecessaryButtons: z.boolean(),
  }),
  "thread:betterCodeBlocks": PluginSettingsSchema.merge(
    BetterCodeBlockGlobalOptionsSchema,
  ),
  "thread:betterCodeBlocks:previewMermaid": PluginSettingsSchema,
  "thread:exportThread": PluginSettingsSchema,
  "thread:betterMessageCopyButtons": PluginSettingsSchema,
  "thread:dragAndDropFileToUploadInThread": PluginSettingsSchema,
  "thread:collapseEmptyThreadVisualCols": PluginSettingsSchema,
  imageGenModelSelector: PluginSettingsSchema,
  onCloudflareTimeoutAutoReload: PluginSettingsSchema.extend({
    behavior: z.enum(["reload", "warn-only"]),
  }),
  blockAnalyticEvents: PluginSettingsSchema,
  "home:customSlogan": PluginSettingsSchema.extend({
    slogan: z.string(),
  }),
  "hide-get-mobile-app-cta-btn": PluginSettingsSchema,
});

export type Plugins = z.infer<typeof PluginsSchema>;
export type PluginId = keyof Plugins;

export function isPluginId(value: string): value is PluginId {
  return Object.keys(PluginsSchema.shape).includes(value);
}
