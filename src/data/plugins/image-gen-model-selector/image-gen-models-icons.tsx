import { AiOutlineOpenAI } from "react-icons/ai";

import BlackForestLabs from "@/components/icons/BlackForestLabsIcon";
import PlaygroundAiIcon from "@/components/icons/PlaygroundAiIcon";
import StabilityAiIcon from "@/components/icons/StabilityAiIcon";
import { ImageGenModel } from "@/data/plugins/image-gen-model-selector/image-gen-model-seletor.types";

export const imageGenModelIcons: Record<
  ImageGenModel["code"],
  React.ElementType
> = {
  flux: BlackForestLabs,
  "dall-e-3": AiOutlineOpenAI,
  default: PlaygroundAiIcon,
  sdxl: StabilityAiIcon,
};
