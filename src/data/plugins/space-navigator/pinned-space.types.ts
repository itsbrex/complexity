import { z } from "zod";

import { SpaceSchema } from "@/services/pplx-api/pplx-api.types";

export const PinnedSpaceSchema = SpaceSchema.pick({
  uuid: true,
  title: true,
  emoji: true,
  slug: true,
}).extend({
  createdAt: z.number(),
});

export type PinnedSpace = z.infer<typeof PinnedSpaceSchema>;
