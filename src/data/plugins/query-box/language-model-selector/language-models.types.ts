import { z } from "zod";

import {
  fastLanguageModels,
  languageModels,
  localLanguageModels,
  reasoningLanguageModels,
} from "@/data/plugins/query-box/language-model-selector/language-models";

export const LanguageModelSchema = z.object({
  label: z.string(),
  shortLabel: z.string(),
  code: z.string().transform((value) => value as LanguageModelCode),
  provider: z.string().transform((value) => value as LanguageModelProvider),
  isReasoningModel: z.boolean(),
  limitKey: z.string().optional(),
  description: z.string().optional(),
});

export type LanguageModel = z.infer<typeof LanguageModelSchema>;

export type LanguageModelCode =
  | (typeof localLanguageModels)[number]["code"]
  | (string & {});

export type LanguageModelProvider =
  | (typeof localLanguageModels)[number]["provider"]
  | (string & {});

export function isLanguageModelCode(
  value: string,
): value is LanguageModel["code"] {
  return languageModels.some((model) => model.code === value);
}

export function isReasoningLanguageModelCode(
  value: string,
): value is LanguageModel["code"] {
  return reasoningLanguageModels.some((model) => model.code === value);
}

export function isFastLanguageModelCode(
  value: string,
): value is LanguageModel["code"] {
  return fastLanguageModels.some((model) => model.code === value);
}
