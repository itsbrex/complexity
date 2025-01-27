import { useImmer } from "use-immer";

import { languageModels } from "@/data/plugins/query-box/language-model-selector/language-models";
import { LanguageModel } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import usePplxUserSettings from "@/hooks/usePplxUserSettings";

export function useModelLimits() {
  const { data } = usePplxUserSettings();

  const getModelLimit = useCallback(
    (model: LanguageModel) => {
      if (model.unknownLimit) {
        return null;
      }

      switch (model.code) {
        case "claude3opus":
          return data?.opus_limit ?? 0;
        case "o1":
          return data?.o1_limit ?? 0;
        case "r1":
          return data?.pro_reasoning_limit ?? 0;
        case "turbo":
          return Infinity;
        default:
          return data?.gpt4_limit ?? 0;
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
