import { LuCpu } from "react-icons/lu";

import { SelectValue } from "@/components/ui/select";
import { languageModels } from "@/data/plugins/query-box/language-model-selector/language-models";
import { ModelTriggerProps } from "@/features/plugins/query-box/language-model-selector/types";

export function ModelTrigger({ value, limit }: ModelTriggerProps) {
  return (
    <div className="tw-flex tw-min-h-8 tw-items-center tw-justify-center tw-gap-1">
      <LuCpu className="tw-size-4" />
      <div className="tw-hidden tw-gap-1 md:tw-flex">
        <SelectValue>
          {languageModels.find((model) => model.code === value)?.shortLabel}
        </SelectValue>
        {limit != null && limit <= 100 && (
          <span className="tw-self-start tw-text-[.5rem] tw-text-primary">
            {limit}
          </span>
        )}
      </div>
    </div>
  );
}
