import { z } from "zod";

import {
  PluginsSchema,
  PluginId,
} from "@/services/extension-local-storage/plugins.types";
import packageJson from "~/package.json";

export const ExtensionLocalStorageSchema = z.object({
  schemaVersion: z.literal(packageJson.version),
  plugins: PluginsSchema,
  favoritePluginIds: z.array(z.string() as z.ZodType<PluginId>),
  theme: z.string(),
  energySavingMode: z.boolean(),
});

export type ExtensionLocalStorage = z.infer<typeof ExtensionLocalStorageSchema>;
