import { createListCollection } from "@ark-ui/react";
import { LuCpu as Cpu, LuImage as Image } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { imageGenModels } from "@/data/plugins/image-gen-model-selector/image-gen-models";
import { imageGenModelIcons } from "@/data/plugins/image-gen-model-selector/image-gen-models-icons";
import { useImageGenModelSelectorStore } from "@/features/plugins/image-gen-popover/store";
import usePplxUserSettings from "@/hooks/usePplxUserSettings";
import { ImageGenModel } from "@/types/plugins/image-gen-model-seletor.types";
import { isReactNode } from "@/types/utils.types";
import { TEST_ID_SELECTORS } from "@/utils/dom-selectors";

export default function ImageGenModelSelector() {
  const { data: pplxUserSettings } = usePplxUserSettings();

  const limit = pplxUserSettings?.create_limit ?? 0;

  const { selectedImageGenModel: value, setSelectedImageGenModel: setValue } =
    useImageGenModelSelectorStore(
      ({ selectedImageGenModel, setSelectedImageGenModel }) => ({
        selectedImageGenModel,
        setSelectedImageGenModel,
      }),
    );

  const handleValueChange = (details: { value: string[] }) => {
    setValue(details.value[0] as ImageGenModel["code"]);
  };

  return (
    <Select
      data-testid={TEST_ID_SELECTORS.QUERY_BOX.IMAGE_GEN_MODEL_SELECTOR}
      collection={createListCollection({
        items: imageGenModels.map((model) => model.code),
      })}
      className="tw-mb-4 tw-ml-auto tw-w-fit"
      value={[value]}
      onValueChange={handleValueChange}
    >
      <Tooltip
        content={t("plugin-model-selectors:imageGenModelSelector.tooltip")}
        positioning={{
          gutter: 8,
        }}
      >
        <SelectTrigger variant="ghost">
          <div className="tw-flex tw-min-h-8 tw-items-center tw-justify-center tw-gap-1">
            <Image className="tw-size-4" />
            <SelectValue>
              {imageGenModels.find((model) => model.code === value)?.shortLabel}
            </SelectValue>
            <span className="tw-self-start tw-text-[.5rem] tw-text-primary">
              {limit}
            </span>
          </div>
        </SelectTrigger>
      </Tooltip>
      <SelectContent className="custom-scrollbar tw-max-h-[500px] tw-max-w-[200px] tw-overflow-auto tw-font-sans">
        {imageGenModels.map((model) => {
          const Icon = imageGenModelIcons[model.code];
          return (
            <Tooltip
              key={model.code}
              content={limit}
              positioning={{
                placement: "right",
                gutter: 10,
              }}
            >
              <SelectItem
                key={model.code}
                item={model.code}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className="tw-flex tw-max-w-full tw-items-center tw-justify-around tw-gap-2">
                  {isReactNode(<Icon />) ? (
                    <div className="tw-text-[1.1rem]">
                      <Icon className="tw-size-4" />
                    </div>
                  ) : (
                    <Cpu className="tw-size-4" />
                  )}
                  <span className="tw-truncate">{model.label}</span>
                </div>
              </SelectItem>
            </Tooltip>
          );
        })}
      </SelectContent>
    </Select>
  );
}
