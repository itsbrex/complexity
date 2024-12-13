import { LuCpu, LuInfinity } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import { getGroupedLanguageModelsByProvider } from "@/data/plugins/query-box/language-model-selector/language-models";
import { languageModelProviderIcons } from "@/data/plugins/query-box/language-model-selector/language-models-icons";
import { useModelLimits } from "@/features/plugins/query-box/language-model-selector/hooks/useModelLimits";

export function DesktopSelectContent() {
  const modelsLimits = useModelLimits();

  const groupedLanguageModelsByProvider = useMemo(() => {
    return getGroupedLanguageModelsByProvider();
  }, []);

  return (
    <SelectContent className="custom-scrollbar tw-max-h-[40svh] tw-max-w-[200px] tw-overflow-auto tw-font-sans">
      {groupedLanguageModelsByProvider.map(({ provider, models }) => (
        <SelectGroup key={provider}>
          <SelectLabel>{provider}</SelectLabel>
          {models.map((model) => {
            const Icon = languageModelProviderIcons[provider];

            return (
              <Tooltip
                key={model.code}
                content={
                  modelsLimits[model.code] === 9999 ? (
                    <LuInfinity />
                  ) : (
                    modelsLimits[model.code]
                  )
                }
                positioning={{ placement: "right", gutter: 10 }}
              >
                <SelectItem key={model.code} item={model.code}>
                  <div className="tw-flex tw-max-w-full tw-items-center tw-justify-around tw-gap-2">
                    {Icon != null ? (
                      <Icon className="tw-size-4" />
                    ) : (
                      <LuCpu className="tw-size-4" />
                    )}
                    <span className="tw-truncate">{model.label}</span>
                  </div>
                </SelectItem>
              </Tooltip>
            );
          })}
        </SelectGroup>
      ))}
    </SelectContent>
  );
}
