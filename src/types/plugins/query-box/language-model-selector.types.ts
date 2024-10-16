import { LanguageModel } from "@/data/consts/plugins/query-box/language-model-selector/language-models.types";

export type LanguageModelProvider = LanguageModel["provider"];
export type GroupedLanguageModelsByProvider = {
  provider: LanguageModelProvider;
  models: LanguageModel[];
}[];
