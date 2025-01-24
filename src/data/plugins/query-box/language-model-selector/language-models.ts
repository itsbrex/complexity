import { GroupedLanguageModelsByProvider } from "@/data/plugins/query-box/language-model-selector/language-model-selector.types";
import { LanguageModel } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { cplxApiQueries } from "@/services/cplx-api/query-keys";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
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
    label: "O1",
    shortLabel: "O1",
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
] as const;

export let languageModels: LanguageModel[] = [...localLanguageModels];
export let groupedLanguageModelsByProvider: GroupedLanguageModelsByProvider =
  getGroupedLanguageModelsByProvider();

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

csLoaderRegistry.register({
  id: "cache:languageModels",
  loader: async () => {
    const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

    if (!pluginsEnableStates?.["queryBox:languageModelSelector"])
      return undefined;

    const [data, error] = await errorWrapper(() =>
      queryClient.fetchQuery({
        ...cplxApiQueries.remoteLanguageModels,
        // gcTime: Infinity,
      }),
    )();

    if (error || !data) {
      languageModels = [...localLanguageModels];
    } else {
      languageModels = data;
      groupedLanguageModelsByProvider = getGroupedLanguageModelsByProvider();
    }
  },
});
