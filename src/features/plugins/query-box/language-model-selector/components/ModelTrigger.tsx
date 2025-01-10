import { LuCpu } from "react-icons/lu";

import { SelectValue } from "@/components/ui/select";
import { languageModels } from "@/data/plugins/query-box/language-model-selector/language-models";
import { LanguageModel } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { useScopedQueryBoxContext } from "@/features/plugins/query-box/context/context";
import { useModelLimits } from "@/features/plugins/query-box/language-model-selector/hooks/useModelLimits";

export function ModelTrigger({ value }: { value: LanguageModel["code"] }) {
  const {
    store: { type },
  } = useScopedQueryBoxContext();

  const model = languageModels.find((model) => model.code === value);

  const modelsLimits = useModelLimits();

  if (model == null) return null;

  const limit = modelsLimits[model.code];

  return (
    <div className="tw-flex tw-min-h-8 tw-items-center tw-justify-center tw-gap-1">
      <LuCpu className="tw-size-4" />
      <div
        className={cn("tw-relative", {
          "tw-hidden md:tw-block": type !== "follow-up",
        })}
      >
        <SelectValue className="tw-font-medium">
          {languageModels.find((model) => model.code === value)?.shortLabel}
        </SelectValue>
        {limit != null && limit <= 100 && (
          <>
            <span className="tw-invisible tw-text-[.5rem] tw-text-primary">
              {limit}
            </span>
            <span className="tw-absolute -tw-right-1 -tw-top-2 tw-text-[.5rem] tw-text-primary">
              {limit}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
