import { z } from "zod";

import packageJson from "~/package.json";

export const PluginSettingsSchema = z.object({
  enabled: z.boolean(),
});

export type PluginSettings = z.infer<typeof PluginSettingsSchema>;

export const PluginsSchema = z.object({
  "queryBox:languageModelSelector": PluginSettingsSchema.extend({
    main: z.boolean(),
    followUp: z.boolean(),
  }),
  "queryBox:noFileCreationOnPaste": PluginSettingsSchema,
  "thread:toc": PluginSettingsSchema,
  imageGenModelSelector: PluginSettingsSchema,
  onCloudflareTimeoutAutoReload: PluginSettingsSchema.extend({
    behavior: z.enum(["reload", "warn-only"]),
  }),
  blockAnalyticEvents: PluginSettingsSchema,
  dragAndDropFileToUploadInThread: PluginSettingsSchema,
  collapseEmptyThreadVisualCols: PluginSettingsSchema,
});

export type PluginId = keyof z.infer<typeof PluginsSchema>;

export const ExtensionLocalStorageSchema = z.object({
  schemaVersion: z.literal(packageJson.version),
  plugins: PluginsSchema,
  favoritePluginIds: z.array(z.string() as z.ZodType<PluginId>),
});

export type ExtensionLocalStorage = z.infer<typeof ExtensionLocalStorageSchema>;

export function isPluginId(value: string): value is PluginId {
  return Object.keys(PluginsSchema.shape).includes(value);
}
