import { LanguageModel } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { cplxApiQueries } from "@/services/cplx-api/query-keys";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";
import { GroupedLanguageModelsByProvider } from "@/types/plugins/query-box/language-model-selector.types";
import { errorWrapper } from "@/utils/error-wrapper";
import { queryClient } from "@/utils/ts-query-client";

// TODO: split the initialize logic into separate file

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
    label: "GPT-4 Omni",
    shortLabel: "GPT-4o",
    code: "gpt4o",
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
];

export let languageModels: LanguageModel[] = localLanguageModels;
export let groupedLanguageModelsByProvider: GroupedLanguageModelsByProvider =
  getGroupedLanguageModelsByProvider();

export async function initializeLanguageModels() {
  const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

  if (!pluginsEnableStates?.["queryBox:languageModelSelector"]) return;

  const [data, error] = await errorWrapper(() =>
    queryClient.fetchQuery({
      ...cplxApiQueries.remoteLanguageModels,
      // gcTime: Infinity,
    }),
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
