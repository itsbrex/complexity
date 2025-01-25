import { LuCpu } from "react-icons/lu";

import { DialogProps } from "@/components/ui/dialog";
import { SelectGroup, SelectItem, SelectLabel } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { getGroupedLanguageModelsByProvider } from "@/data/plugins/query-box/language-model-selector/language-models";
import { languageModelProviderIcons } from "@/data/plugins/query-box/language-model-selector/language-models-icons";
import { useModelLimits } from "@/plugins/language-model-selector/hooks/useModelLimits";
import { isReactNode } from "@/types/utils.types";

export function MobileSelectContent({ ...props }: DialogProps) {
  const modelsLimits = useModelLimits();

  const groupedLanguageModelsByProvider = useMemo(() => {
    return getGroupedLanguageModelsByProvider();
  }, []);

  return (
    <Sheet lazyMount unmountOnExit {...props}>
      <SheetContent side="bottom" className="x-space-y-6">
        {groupedLanguageModelsByProvider.map(({ provider, models }) => (
          <SelectGroup key={provider} className="x-space-y-3">
            <SelectLabel className="x-text-lg">{provider}</SelectLabel>

            {models.map((model) => {
              const Icon = languageModelProviderIcons[provider];

              if (Icon == null) return null;

              return (
                <SelectItem
                  key={model.code}
                  item={model.code}
                  className="x-py-3 x-font-medium"
                >
                  <div className="x-flex x-w-full x-max-w-full x-items-center x-justify-between x-gap-4">
                    <div className="x-flex x-items-center x-gap-3">
                      {isReactNode(<Icon />) ? (
                        <Icon className="x-size-5" />
                      ) : (
                        <LuCpu className="x-size-5" />
                      )}
                      <span className="x-truncate">{model.label}</span>
                    </div>

                    <div className="x-text-sm x-text-muted-foreground">
                      {modelsLimits[model.code]}
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
