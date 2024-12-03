import { z } from "zod";

import {
  languageModels,
  localLanguageModels,
} from "@/data/plugins/query-box/language-model-selector/language-models";

export const LanguageModelSchema = z.object({
  label: z.string(),
  shortLabel: z.string(),
  code: z.string().transform((value) => value as LanguageModelCode),
  provider: z.string().transform((value) => value as LanguageModelProvider),
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
