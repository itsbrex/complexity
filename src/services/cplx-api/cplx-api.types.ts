import { z } from "zod";

export const CplxVersionsApiResponseSchema = z.object({
  latest: z.string(),
  changelogEntries: z.array(z.string()),
  featureFlagsEntries: z.array(z.string()),
});

export type CplxVersionsApiResponse = z.infer<
  typeof CplxVersionsApiResponseSchema
>;
