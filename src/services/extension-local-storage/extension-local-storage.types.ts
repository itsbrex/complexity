import { z } from "zod";

import { EXTENSION_ICON_ACTIONS } from "@/data/dashboard/extension-storage";
import {
  PluginsSchema,
  PluginId,
} from "@/services/extension-local-storage/plugins.types";
import packageJson from "~/package.json";

export const ExtensionLocalStorageSchema = z.object({
  schemaVersion: z.literal(packageJson.version),
  shouldShowPostUpdateReleaseNotes: z.boolean(),
  plugins: PluginsSchema,
  favoritePluginIds: z.array(z.string() as z.ZodType<PluginId>),
  theme: z.string(),
  preloadTheme: z.boolean(),
  energySavingMode: z.boolean(),
  extensionIconAction: z.enum(EXTENSION_ICON_ACTIONS),
  cdnLastUpdated: z.number(),
  devMode: z.boolean(),
});

export type ExtensionLocalStorage = z.infer<typeof ExtensionLocalStorageSchema>;
