import { LuCpu, LuInfinity } from "react-icons/lu";

import { SelectGroup, SelectItem, SelectLabel } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { getGroupedLanguageModelsByProvider } from "@/data/plugins/query-box/language-model-selector/language-models";
import { languageModelProviderIcons } from "@/data/plugins/query-box/language-model-selector/language-models-icons";
import { useModelLimits } from "@/features/plugins/query-box/language-model-selector/hooks/useModelLimits";
import { SelectContentProps } from "@/features/plugins/query-box/language-model-selector/types";
import { isReactNode } from "@/types/utils.types";

export function MobileSelectContent({ ...props }: SelectContentProps) {
  const modelsLimits = useModelLimits();

  const groupedLanguageModelsByProvider = useMemo(() => {
    return getGroupedLanguageModelsByProvider();
  }, []);

  return (
    <Sheet lazyMount unmountOnExit {...props}>
      <SheetContent side="bottom" className="tw-space-y-6">
        {groupedLanguageModelsByProvider.map(({ provider, models }) => (
          <SelectGroup key={provider} className="tw-space-y-3">
            <SelectLabel className="tw-text-lg">{provider}</SelectLabel>

            {models.map((model) => {
              const Icon = languageModelProviderIcons[provider];

              if (Icon == null) return null;

              return (
                <SelectItem
                  key={model.code}
                  item={model.code}
                  className="tw-py-3"
                >
                  <div className="tw-flex tw-w-full tw-max-w-full tw-items-center tw-justify-between tw-gap-4">
                    <div className="tw-flex tw-items-center tw-gap-3">
                      {isReactNode(<Icon />) ? (
                        <Icon className="tw-size-5" />
                      ) : (
                        <LuCpu className="tw-size-5" />
                      )}
                      <span className="tw-truncate">{model.label}</span>
                    </div>

                    <div className="tw-text-sm tw-text-muted-foreground">
                      {modelsLimits[model.code] === 9999 ? (
                        <LuInfinity className="tw-size-5" />
                      ) : (
                        modelsLimits[model.code]
                      )}
                    </div>
                  </div>
                </SelectItem>
              );
            })}
          </SelectGroup>
        ))}
      </SheetContent>
    </Sheet>
  );
}
