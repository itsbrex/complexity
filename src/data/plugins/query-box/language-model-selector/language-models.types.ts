import { z } from "zod";

import {
  languageModels,
  localLanguageModels,
} from "@/data/plugins/query-box/language-model-selector/language-models";

export const LanguageModelsSchema = z.array(
  z.object({
    label: z.string(),
    shortLabel: z.string(),
    code: z.string(),
    provider: z.string(),
  }),
);

export type LanguageModel = Readonly<{
  label: string;
  shortLabel: string;
  code: LanguageModelCode;
  provider: LanguageModelProvider;
}>;

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
