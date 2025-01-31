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
    limitKey: "gpt4_limit",
  },
  {
    label: "Claude 3.5 Haiku",
    shortLabel: "Haiku",
    code: "claude35haiku",
    provider: "Anthropic",
    limitKey: "gpt4_limit",
  },
  {
    label: "DeepSeek R1",
    shortLabel: "R1",
    code: "r1",
    provider: "DeepSeek",
    limitKey: "pro_reasoning_limit",
  },
  {
    label: "O1",
    shortLabel: "O1",
    code: "o1",
    provider: "OpenAI",
    limitKey: "o1_limit",
  },
  {
    label: "GPT-4 Omni",
    shortLabel: "GPT-4o",
    code: "gpt4o",
    provider: "OpenAI",
    limitKey: "gpt4_limit",
  },
  {
    label: "Grok-2",
    shortLabel: "Grok-2",
    code: "grok",
    provider: "xAI",
    limitKey: "gpt4_limit",
  },
  {
    label: "Sonar Huge",
    shortLabel: "Sonar XL",
    code: "llama_x_large",
    provider: "Perplexity",
    limitKey: "gpt4_limit",
  },
  {
    label: "Sonar Large",
    shortLabel: "Sonar",
    code: "experimental",
    provider: "Perplexity",
    limitKey: "gpt4_limit",
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

    if (!pluginsEnableStates["queryBox:languageModelSelector"])
      return undefined;

    const [data, error] = await errorWrapper(() =>
      queryClient.fetchQuery({
        ...cplxApiQueries.remoteLanguageModels,
        // gcTime: Infinity,
      }),
    )();

    if (!error && data) {
      languageModels = data;
      groupedLanguageModelsByProvider = getGroupedLanguageModelsByProvider();
    }
  },
});
