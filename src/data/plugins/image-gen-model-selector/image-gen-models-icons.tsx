import { AiOutlineOpenAI } from "react-icons/ai";

import BlackForestLabs from "@/components/icons/BlackForestLabsIcon";
import PlaygroundAiIcon from "@/components/icons/PlaygroundAiIcon";
import StabilityAiIcon from "@/components/icons/StabilityAiIcon";
import { ImageGenModel } from "@/types/plugins/image-gen-model-seletor.types";

export const imageGenModelIcons: Record<
  ImageGenModel["code"],
  React.ElementType
> = {
  flux: BlackForestLabs,
  "dall-e-3": AiOutlineOpenAI,
  default: PlaygroundAiIcon,
  sdxl: StabilityAiIcon,
};
