import {
  LanguageModel,
  LanguageModelsSchema,
} from "@/data/consts/plugins/query-box/language-model-selector/language-models.types";
import {
  CplxFeatureFlags,
  CplxFeatureFlagsSchema,
} from "@/services/cplx-api/feature-flags/cplx-feature-flags.types";

export class CplxApiService {
  static async fetchFeatureFlags() {
    const randomSleepFrom100to300ms = Math.floor(
      Math.random() * (300 - 100) + 100,
    );

    await sleep(randomSleepFrom100to300ms);

    throw new Error("Not implemented");

    return CplxFeatureFlagsSchema.parse({
      anon: {
        forceDisable: [
          "queryBox:languageModelSelector",
          "queryBox:noFileCreationOnPaste",
          "onCloudflareTimeoutAutoReload",
        ],
        hide: ["queryBox:languageModelSelector"],
      },
    } satisfies CplxFeatureFlags);
  }

  static async fetchLanguageModels() {
    const randomSleepFrom100to300ms = Math.floor(
      Math.random() * (300 - 100) + 100,
    );

    await sleep(randomSleepFrom100to300ms);

    throw new Error("Not implemented");

    return LanguageModelsSchema.parse([
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
        label: "Claude 3.5 Opus",
        shortLabel: "Opus",
        code: "claude35opus",
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
    ] satisfies LanguageModel[]);
  }
}
