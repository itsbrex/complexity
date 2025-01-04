import { z } from "zod";

export const CplxVersionsApiResponseSchema = z.object({
  latest: z.string(),
  latestFirefox: z.string(),
  changelogEntries: z.array(z.string()),
  featureFlagsEntries: z.array(z.string()),
  canvasInstructionLastUpdated: z.number().optional(),
});

export type CplxVersionsApiResponse = z.infer<
  typeof CplxVersionsApiResponseSchema
>;

export type CplxVersions = Omit<CplxVersionsApiResponse, "latestFirefox">;
