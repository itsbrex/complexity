import { LuCpu } from "react-icons/lu";

import { SelectValue } from "@/components/ui/select";
import { languageModels } from "@/data/plugins/query-box/language-model-selector/language-models";
import { LanguageModel } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { useScopedQueryBoxContext } from "@/plugins/_core/ui-groups/query-box/context/context";
import { useModelLimits } from "@/plugins/language-model-selector/hooks/useModelLimits";

export function ModelTrigger({ value }: { value: LanguageModel["code"] }) {
  const {
    store: { type },
  } = useScopedQueryBoxContext();

  const model = languageModels.find((model) => model.code === value);

  const modelsLimits = useModelLimits();

  if (model == null) return null;

  const limit = modelsLimits[model.code];

  return (
    <div className="x-flex x-min-h-8 x-items-center x-justify-center x-gap-1">
      <LuCpu className="x-size-4" />
      <div
        className={cn("x-flex x-items-center x-gap-1", {
          "x-hidden md:x-flex": type !== "follow-up",
        })}
      >
        <SelectValue className="x-block x-font-medium">
          {languageModels.find((model) => model.code === value)?.shortLabel}
        </SelectValue>
        {limit != null && limit <= 100 && (
          <span className="x-text-xs x-text-primary">({limit})</span>
        )}
      </div>
    </div>
  );
}
