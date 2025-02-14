import { Trans } from "react-i18next";
import { LuCpu } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { SelectItem, SelectGroup, SelectLabel } from "@/components/ui/select";
import { reasoningLanguageModels } from "@/data/plugins/query-box/language-model-selector/language-models";
import { languageModelProviderIcons } from "@/data/plugins/query-box/language-model-selector/language-models-icons";
import { useModelLimits } from "@/plugins/language-model-selector/hooks/useModelLimits";
import { t } from "@/utils/i18next";

export default function ReasoningLanguageModels() {
  const modelsLimits = useModelLimits();

  return (
    <SelectGroup className="x-m-0 x-p-0">
      <Tooltip
        content={
          <div className="x-max-w-[250px]">
            <div>
              {t(
                "plugin-model-selectors:languageModelSelector.reasoningModels.tooltip.description",
              )}
            </div>
            <Trans
              i18nKey="plugin-model-selectors:languageModelSelector.reasoningModels.tooltip.proSearchNote"
              components={{
                emphasis: <span className="x-text-primary" />,
              }}
            />
          </div>
        }
        positioning={{
          placement: "right",
        }}
      >
        <SelectLabel>Reasoning</SelectLabel>
      </Tooltip>
      {reasoningLanguageModels.map((model, index) => {
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
          <Tooltip
            key={model.code}
            content={
              <div className="x-max-w-48 x-text-pretty">{tooltipContent}</div>
            }
            disabled={modelsLimits[model.code] == null}
            positioning={{ placement: "right", gutter: 10 }}
          >
            <SelectItem
              key={model.code}
              item={model.code}
              data-column="reasoning"
              data-index={index}
              className="x-flex x-items-center x-justify-start x-gap-2 x-text-foreground"
            >
              <Icon className="x-size-4" />
              <span>{model.label}</span>
            </SelectItem>
          </Tooltip>
        );
      })}
    </SelectGroup>
  );
}
