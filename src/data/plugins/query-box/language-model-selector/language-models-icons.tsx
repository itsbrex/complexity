import { AiOutlineOpenAI } from "react-icons/ai";
import { SiAnthropic, SiGooglegemini, SiPerplexity } from "react-icons/si";

import MistralAiIcon from "@/components/icons/MistralAiIcon";
import XAiIcon from "@/components/icons/XAiIcon";
import { LanguageModelProvider } from "@/data/plugins/query-box/language-model-selector/language-models.types";

export const languageModelProviderIcons: Record<
  LanguageModelProvider,
  React.ElementType
> = {
  Anthropic: SiAnthropic,
  OpenAI: AiOutlineOpenAI,
  xAI: XAiIcon,
  Perplexity: SiPerplexity,
  Google: SiGooglegemini,
  Mistral: MistralAiIcon,
};
