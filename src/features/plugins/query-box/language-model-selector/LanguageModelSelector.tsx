import { createListCollection, SelectContext } from "@ark-ui/react";

import Tooltip from "@/components/Tooltip";
import { Select, SelectTrigger } from "@/components/ui/select";
import { languageModels } from "@/data/plugins/query-box/language-model-selector/language-models";
import { DesktopSelectContent } from "@/features/plugins/query-box/language-model-selector/components/DesktopSelectContent";
import { MobileSelectContent } from "@/features/plugins/query-box/language-model-selector/components/MobileSelectContent";
import { ModelTrigger } from "@/features/plugins/query-box/language-model-selector/components/ModelTrigger";
import { useModelLimits } from "@/features/plugins/query-box/language-model-selector/hooks/useModelLimits";
import { useSharedQueryBoxStore } from "@/features/plugins/query-box/shared-store";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { TEST_ID_SELECTORS } from "@/utils/dom-selectors";
import UiUtils from "@/utils/UiUtils";

export default function LanguageModelSelector() {
  const { isMobile } = useIsMobileStore();

  const value = useSharedQueryBoxStore((state) => state.selectedLanguageModel);
  const setValue = useSharedQueryBoxStore(
    (state) => state.setSelectedLanguageModel,
  );

  const modelsLimits = useModelLimits();

  const handleValueChange = (details: { value: string[] }) => {
    if (details.value[0] == null) return;

    setValue(details.value[0]);
    setTimeout(() => {
      UiUtils.getActiveQueryBoxTextarea().trigger("focus");
    }, 100);
  };

  return (
    <Select
      data-testid={TEST_ID_SELECTORS.QUERY_BOX.LANGUAGE_MODEL_SELECTOR}
      collection={createListCollection({
        items: languageModels.map((model) => model.code),
      })}
      value={[value]}
      onValueChange={handleValueChange}
    >
      <Tooltip
        content={t("plugin-model-selectors:languageModelSelector.tooltip")}
        positioning={{ gutter: 8 }}
      >
        <SelectTrigger variant="ghost">
          <ModelTrigger value={value} limit={modelsLimits[value]} />
        </SelectTrigger>
      </Tooltip>
      <SelectContext>
        {({ open, setOpen }) => {
          return isMobile ? (
            <MobileSelectContent
              open={open}
              onOpenChange={({ open }) => setOpen(open)}
            />
          ) : (
            <DesktopSelectContent />
          );
        }}
      </SelectContext>
    </Select>
  );
}
