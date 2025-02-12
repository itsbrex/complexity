import Tooltip from "@/components/Tooltip";
import { Switch } from "@/components/ui/switch";
import {
  isFastLanguageModelCode,
  isReasoningLanguageModelCode,
} from "@/data/plugins/query-box/language-model-selector/language-models.types";
import usePplxUserSettings from "@/hooks/usePplxUserSettings";
import { useSharedQueryBoxStore } from "@/plugins/_core/ui-groups/query-box/shared-store";

export default function ProSearchSwitch({
  setHighlightedItem,
}: {
  setHighlightedItem: (item: string) => void;
}) {
  const { selectedLanguageModel } = useSharedQueryBoxStore((store) => ({
    selectedLanguageModel: store.selectedLanguageModel,
  }));

  const { isProSearchEnabled, setIsProSearchEnabled } = useSharedQueryBoxStore(
    (store) => ({
      isProSearchEnabled: store.isProSearchEnabled,
      setIsProSearchEnabled: store.setIsProSearchEnabled,
    }),
  );

  const { data: userSettings } = usePplxUserSettings();

  const handleToggleOff = useCallback(
    (checked: boolean) => {
      if (checked) return;

      if (!isReasoningLanguageModelCode(selectedLanguageModel)) return;

      if (
        userSettings?.default_model == null ||
        !isFastLanguageModelCode(userSettings?.default_model)
      )
        return;

      setHighlightedItem(userSettings?.default_model);
    },
    [selectedLanguageModel, setHighlightedItem, userSettings?.default_model],
  );

  return (
    <Tooltip
      content={t(
        "plugin-model-selectors:languageModelSelector.proSearch.tooltip",
      )}
      positioning={{
        placement: "right",
      }}
    >
      <Switch
        checked={isProSearchEnabled}
        textLabel="Pro Search"
        onCheckedChange={({ checked }) => {
          setIsProSearchEnabled(checked);
          handleToggleOff(checked);
        }}
      />
    </Tooltip>
  );
}
