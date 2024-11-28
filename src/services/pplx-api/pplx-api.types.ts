import { z } from "zod";

import { LanguageModel } from "@/data/plugins/query-box/language-model-selector/language-models.types";

export const UserSettingsApiResponseSchema = z.object({
  has_ai_profile: z.boolean(),
  default_copilot: z.boolean().nullable(),
  default_model: z.string(),
  default_image_generation_model: z.string(),
  subscription_status: z.enum(["active", "trialing", "none"]).optional(),
  gpt4_limit: z.number(),
  opus_limit: z.number(),
  o1_limit: z.number(),
  create_limit: z.number(),
  query_count: z.number(),
});

export type UserSettingsApiResponse = z.infer<
  typeof UserSettingsApiResponseSchema
>;

export const OrgSettingsApiResponseSchema = z.object({
  is_in_organization: z.boolean(),
});

export type OrgSettingsApiResponse = z.infer<
  typeof OrgSettingsApiResponseSchema
>;

export const ThreadMessageApiResponseSchema = z.object({
  query_str: z.string(),
  text: z.string(),
  backend_uuid: z.string(),
  author_image: z.string().nullable(),
  author_username: z.string(),
  thread_url_slug: z.string(),
  display_model: z.string().transform((val) => val as LanguageModel["code"]),
});

export type ThreadMessageApiResponse = z.infer<
  typeof ThreadMessageApiResponseSchema
>;
