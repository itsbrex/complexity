import { LanguageModel } from "@/data/consts/plugins/query-box/language-model-selector/language-models.types";
import { cplxApiQueries } from "@/services/cplx-api/query-keys";
import { GroupedLanguageModelsByProvider } from "@/types/plugins/query-box/language-model-selector.types";
import { errorWrapper } from "@/utils/error-wrapper";
import { queryClient } from "@/utils/ts-query-client";

export const localLanguageModels = [
  {
    label: "Claude 3.5 Sonnet",
    shortLabel: "Sonnet",
    code: "claude2",
    provider: "Anthropic",
  },
  {
    label: "Claude 3.5 Haiku",
    shortLabel: "Haiku",
    code: "claude35haiku",
    provider: "Anthropic",
  },
  {
    label: "Claude 3 Opus",
    shortLabel: "Opus",
    code: "claude3opus",
    provider: "Anthropic",
  },
  {
    label: "O1 Mini",
    shortLabel: "O1 Mini",
    code: "o1",
    provider: "OpenAI",
  },
  {
    label: "GPT-4 Omni",
    shortLabel: "GPT-4o",
    code: "gpt4o",
    provider: "OpenAI",
  },
  {
    label: "GPT-4 Turbo",
    shortLabel: "GPT-4",
    code: "gpt4",
    provider: "OpenAI",
  },
  {
    label: "Grok-2",
    shortLabel: "Grok-2",
    code: "grok",
    provider: "xAI",
  },
  {
    label: "Sonar Huge",
    shortLabel: "Sonar XL",
    code: "llama_x_large",
    provider: "Perplexity",
  },
  {
    label: "Sonar Large",
    shortLabel: "Sonar",
    code: "experimental",
    provider: "Perplexity",
  },
  {
    label: "Default",
    shortLabel: "Default",
    code: "turbo",
    provider: "Perplexity",
  },
  {
    label: "Mistral Large",
    shortLabel: "Mistral",
    code: "mistral",
    provider: "Mistral",
  },
  {
    label: "Gemini Pro",
    shortLabel: "Gemini",
    code: "gemini",
    provider: "Google",
  },
] as const;

export let languageModels: readonly LanguageModel[] = localLanguageModels;
export let groupedLanguageModelsByProvider: GroupedLanguageModelsByProvider =
  getGroupedLanguageModelsByProvider();

export async function initializeLanguageModels() {
  const [data, error] = await errorWrapper(() =>
    queryClient.fetchQuery(cplxApiQueries.remoteLanguageModels),
  )();

  if (error || !data) {
    languageModels = localLanguageModels;
  } else {
    languageModels = data;
    groupedLanguageModelsByProvider = getGroupedLanguageModelsByProvider();
  }

  return languageModels;
}

export function getGroupedLanguageModelsByProvider() {
  return languageModels.reduce((acc, model) => {
    const existingGroup = acc.find(
      (group) => group.provider === model.provider,
    );

    if (!existingGroup) {
      acc.push({ provider: model.provider, models: [model] });
    } else {
      existingGroup.models.push(model);
    }

    return acc;
  }, [] as GroupedLanguageModelsByProvider);
}
