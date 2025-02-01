import { LuCpu } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import { getGroupedLanguageModelsByProvider } from "@/data/plugins/query-box/language-model-selector/language-models";
import { languageModelProviderIcons } from "@/data/plugins/query-box/language-model-selector/language-models-icons";
import { useModelLimits } from "@/plugins/language-model-selector/hooks/useModelLimits";

export function DesktopSelectContent() {
  const modelsLimits = useModelLimits();

  const groupedLanguageModelsByProvider = useMemo(() => {
    return getGroupedLanguageModelsByProvider();
  }, []);

  return (
    <SelectContent className="custom-scrollbar x-max-h-[40svh] x-max-w-[200px] x-overflow-auto x-font-sans">
      {groupedLanguageModelsByProvider.map(({ provider, models }) => (
        <SelectGroup key={provider}>
          <SelectLabel>{provider}</SelectLabel>
          {models.map((model) => {
            const Icon = languageModelProviderIcons[provider];

            const limit =
              modelsLimits[model.code] === Infinity
                ? "Unlimited"
                : modelsLimits[model.code];

            const tooltipContent = model.description
              ? `${limit} uses left. ${model.description}`
              : `${limit} uses left`;

            return (
              <Tooltip
                key={model.code}
                content={tooltipContent}
                disabled={modelsLimits[model.code] == null}
                positioning={{ placement: "right", gutter: 10 }}
              >
                <SelectItem
                  key={model.code}
                  item={model.code}
                  className="x-font-medium x-text-foreground"
                >
                  <div className="x-flex x-w-full x-max-w-full x-items-center x-justify-start x-gap-2">
                    {Icon != null ? (
                      <Icon className="x-size-4" />
                    ) : (
                      <LuCpu className="x-size-4" />
                    )}
                    <span className="x-truncate">{model.label}</span>
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
