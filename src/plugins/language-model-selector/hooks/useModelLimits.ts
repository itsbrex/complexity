import { useImmer } from "use-immer";

import { languageModels } from "@/data/plugins/query-box/language-model-selector/language-models";
import { LanguageModel } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import usePplxUserSettings from "@/hooks/usePplxUserSettings";

export function useModelLimits() {
  const { data } = usePplxUserSettings();

  const getModelLimit = useCallback(
    (model: LanguageModel) => {
      switch (model.code) {
        case "turbo":
          return Infinity;
        default: {
          const limitKey = model.limitKey;
          if (!limitKey) return null;
          return (data as any)?.[limitKey] ?? null;
        }
      }
    },
    [data],
  );

  const [modelsLimits, setModelsLimits] = useImmer<
    Partial<Record<LanguageModel["code"], number | null>>
  >({});

  useEffect(() => {
    setModelsLimits((draft) => {
      languageModels.forEach((model) => {
        draft[model.code] = getModelLimit(model);
      });
    });
  }, [data, getModelLimit, setModelsLimits]);

  return modelsLimits;
}
