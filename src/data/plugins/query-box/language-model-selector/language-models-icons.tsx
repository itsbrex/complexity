import {
  SiAnthropic,
  SiGooglegemini,
  SiOpenai,
  SiPerplexity,
} from "react-icons/si";

import DeepSeek from "@/components/icons/DeepSeek";
import MistralAiIcon from "@/components/icons/MistralAiIcon";
import XAiIcon from "@/components/icons/XAiIcon";
import { LanguageModelProvider } from "@/data/plugins/query-box/language-model-selector/language-models.types";

export const languageModelProviderIcons: Record<
  LanguageModelProvider,
  React.ElementType
> = {
  Anthropic: SiAnthropic,
  OpenAI: SiOpenai,
  xAI: XAiIcon,
  Perplexity: SiPerplexity,
  Google: SiGooglegemini,
  Mistral: MistralAiIcon,
  DeepSeek: DeepSeek,
};
