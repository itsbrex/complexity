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

export const ThreadSearchApiSchema = z.object({
  thread_number: z.number(),
  last_query_datetime: z.string(),
  mode: z.string(),
  context_uuid: z.string(),
  uuid: z.string(),
  slug: z.string(),
  title: z.string(),
  first_answer: z.string(),
  thread_access: z.number(),
  query_count: z.number(),
  search_focus: z.string(),
  read_write_token: z.string(),
  collection: z
    .object({
      uuid: z.string(),
      title: z.string(),
      emoji: z.string(),
      slug: z.string(),
    })
    .optional(),
});

export type ThreadSearchApi = z.infer<typeof ThreadSearchApiSchema>;

export const ThreadsSearchApiResponseSchema = z.array(ThreadSearchApiSchema);

export type ThreadsSearchApiResponse = z.infer<
  typeof ThreadsSearchApiResponseSchema
>;

export const SpaceSchema = z.object({
  title: z.string(),
  uuid: z.string(),
  instructions: z.string(),
  slug: z.string(),
  emoji: z.string().nullable().optional(),
  description: z.string(),
  access: z.number(),
  model_selection: z
    .string()
    .transform((val) => val as LanguageModel["code"])
    .nullable(),
});

export const SpacesApiResponseSchema = z.array(SpaceSchema);

export type Space = z.infer<typeof SpaceSchema>;

export const SpaceFilesApiResponseSchema = z.object({
  files: z.array(
    z.object({
      filename: z.string(),
      file_uuid: z.string(),
      file_s3_url: z.string(),
      uploaded_by: z.string(),
      file_size: z.number(),
      time_created: z.string(),
      error: z.string().nullable(),
    }),
  ),
  num_total_files: z.number(),
});

export type SpaceFilesApiResponse = z.infer<typeof SpaceFilesApiResponseSchema>;

export const SpaceFileDownloadUrlApiResponseSchema = z.object({
  file_url: z.string(),
});

export type SpaceFileDownloadUrlApiResponse = z.infer<
  typeof SpaceFileDownloadUrlApiResponseSchema
>;

export const SpaceThreadsApiResponseSchema = ThreadsSearchApiResponseSchema;

export type SpaceThreadsApiResponse = z.infer<
  typeof SpaceThreadsApiResponseSchema
>;
