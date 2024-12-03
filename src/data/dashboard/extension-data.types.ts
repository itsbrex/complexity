import { z } from "zod";

import { BetterCodeBlockFineGrainedOptionsSchema } from "@/data/dashboard/better-code-blocks/better-code-blocks-options.types";
import { ThemeSchema } from "@/data/plugins/themes/theme-registry.types";
import { ExtensionLocalStorageSchema } from "@/services/extension-local-storage/extension-local-storage.types";

export const ExtensionDataSchema = z.object({
  localStorage: ExtensionLocalStorageSchema,
  db: z.object({
    themes: z.array(ThemeSchema),
    betterCodeBlocksFineGrainedOptions: z.array(
      BetterCodeBlockFineGrainedOptionsSchema,
    ),
  }),
});

export type ExtensionData = z.infer<typeof ExtensionDataSchema>;
