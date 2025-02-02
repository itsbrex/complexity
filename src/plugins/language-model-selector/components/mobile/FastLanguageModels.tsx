import { LuCpu } from "react-icons/lu";

import { SelectItem, SelectGroup, SelectLabel } from "@/components/ui/select";
import { fastLanguageModels } from "@/data/plugins/query-box/language-model-selector/language-models";
import { languageModelProviderIcons } from "@/data/plugins/query-box/language-model-selector/language-models-icons";
import { useModelLimits } from "@/plugins/language-model-selector/hooks/useModelLimits";

export default function FastLanguageModels() {
  const modelsLimits = useModelLimits();

  return (
    <SelectGroup className="x-m-0 x-p-0">
      <SelectLabel className="x-text-base">Fast Models</SelectLabel>
      {fastLanguageModels.map((model, index) => {
        const Icon = languageModelProviderIcons[model.provider] ?? LuCpu;

        const modelLimit = modelsLimits[model.code];
        const limit =
          modelLimit === Infinity
            ? t(
                "plugin-model-selectors:languageModelSelector.reasoningModels.usesLeft.unlimited",
              )
            : typeof modelLimit === "number"
              ? t(
                  "plugin-model-selectors:languageModelSelector.reasoningModels.usesLeft.limited",
                  { count: modelLimit },
                )
              : "";

        const tooltipContent = model.description
          ? `${limit} ${model.description}`
          : limit;

        return (
          <SelectItem
            key={model.code}
            item={model.code}
            data-column="fast"
            data-index={index}
            className="x-flex x-items-center x-justify-between x-gap-2 x-p-4 x-text-base x-text-foreground"
          >
            <div className="x-flex x-items-center x-gap-2">
              <Icon className="x-size-4" />
              <span className="x-truncate">{model.label}</span>
            </div>
            <div className="x-text-xs x-text-muted-foreground">
              {tooltipContent}
            </div>
          </SelectItem>
        );
      })}
    </SelectGroup>
  );
}
