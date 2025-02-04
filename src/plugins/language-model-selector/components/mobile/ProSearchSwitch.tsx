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
    <div className="x-flex x-flex-col x-items-end x-gap-2">
      <div className="x-flex x-items-center x-gap-4">
        <div
          className={cn(
            "x-text-lg x-text-muted-foreground x-transition-colors",
            {
              "x-text-primary": isProSearchEnabled,
            },
          )}
        >
          Pro Search
        </div>
        <Switch
          checked={isProSearchEnabled}
          size="lg"
          onCheckedChange={({ checked }) => {
            setIsProSearchEnabled(checked);
            handleToggleOff(checked);
          }}
        />
      </div>
    </div>
  );
}
