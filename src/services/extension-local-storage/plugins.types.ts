import type { BundledTheme } from "shiki";
import { z } from "zod";

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
  "queryBox:noFileCreationOnPaste": PluginSettingsSchema,
  "thread:toc": PluginSettingsSchema,
  "thread:betterMessageToolbars": PluginSettingsSchema.extend({
    sticky: z.boolean(),
    simplifyRewriteDropdown: z.boolean(),
    explicitModelName: z.boolean(),
    hideUnnecessaryButtons: z.boolean(),
  }),
  "thread:betterCodeBlocks": PluginSettingsSchema.extend({
    stickyHeader: z.boolean(),
    theme: z.object({
      enabled: z.boolean(),
      light: z.string().transform((val): BundledTheme => val as BundledTheme),
      dark: z.string().transform((val): BundledTheme => val as BundledTheme),
    }),
    unwrap: z.object({
      enabled: z.boolean(),
      showToggleButton: z.boolean(),
    }),
    maxHeight: z.object({
      enabled: z.boolean(),
      value: z.number(),
      showToggleButton: z.boolean(),
    }),
  }),
  "thread:betterMessageCopyButtons": PluginSettingsSchema,
  imageGenModelSelector: PluginSettingsSchema,
  onCloudflareTimeoutAutoReload: PluginSettingsSchema.extend({
    behavior: z.enum(["reload", "warn-only"]),
  }),
  blockAnalyticEvents: PluginSettingsSchema,
  dragAndDropFileToUploadInThread: PluginSettingsSchema,
  collapseEmptyThreadVisualCols: PluginSettingsSchema,
});

export type Plugins = z.infer<typeof PluginsSchema>;
export type PluginId = keyof Plugins;

export function isPluginId(value: string): value is PluginId {
  return Object.keys(PluginsSchema.shape).includes(value);
}
