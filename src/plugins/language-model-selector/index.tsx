import { createListCollection } from "@ark-ui/react";

import { Select, SelectContext, SelectTrigger } from "@/components/ui/select";
import {
  fastLanguageModels,
  reasoningLanguageModels,
} from "@/data/plugins/query-box/language-model-selector/language-models";
import { LanguageModelCode } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import useBindBetterLanguageModelSelectorHotKeys from "@/plugins/_core/ui-groups/query-box/hooks/useBindHotKeys";
import { useSharedQueryBoxStore } from "@/plugins/_core/ui-groups/query-box/shared-store";
import DesktopContent from "@/plugins/language-model-selector/components/desktop";
import MobileContent from "@/plugins/language-model-selector/components/mobile";
import BetterLanguageModelSelectorTriggerButton from "@/plugins/language-model-selector/components/TriggerButton";
import { useColumnNavigation } from "@/plugins/language-model-selector/hooks/useColumnNavigation";
import { TEST_ID_SELECTORS } from "@/utils/dom-selectors";
import { UiUtils } from "@/utils/ui-utils";

const selectItems = [...fastLanguageModels, ...reasoningLanguageModels].map(
  (model) => ({
    id: model.code,
    label: model.label,
  }),
);

export default function BetterLanguageModelSelectorWrapper() {
  const { isMobile } = useIsMobileStore();

  const { selectedLanguageModel, setSelectedLanguageModel } =
    useSharedQueryBoxStore((store) => ({
      selectedLanguageModel: store.selectedLanguageModel,
      setSelectedLanguageModel: store.setSelectedLanguageModel,
    }));

  const [highlightedItem, setHighlightedItem] = useState<LanguageModelCode>(
    selectedLanguageModel,
  );

  const [isOpen, setIsOpen] = useState(false);

  useColumnNavigation({
    highlightedItem,
    setHighlightedItem,
    enabled: isOpen,
  });

  useBindBetterLanguageModelSelectorHotKeys();

  return (
    <Select
      lazyMount
      unmountOnExit
      portal={false}
      collection={createListCollection({
        items: selectItems,
        itemToString: (item) => item.label,
        itemToValue: (item) => item.id,
      })}
      data-testid={TEST_ID_SELECTORS.QUERY_BOX.LANGUAGE_MODEL_SELECTOR}
      open={isOpen}
      value={[selectedLanguageModel]}
      highlightedValue={highlightedItem}
      onOpenChange={({ open }) => setIsOpen(open)}
      onValueChange={({ value }) => {
        setSelectedLanguageModel(value[0] as LanguageModelCode);

        setTimeout(() => {
          UiUtils.getActiveQueryBoxTextarea().trigger("focus");
        }, 100);
      }}
      onHighlightChange={({ highlightedValue }) =>
        setHighlightedItem(highlightedValue as LanguageModelCode)
      }
      onKeyDown={(event) => {
        if (event.key === Key.Escape) {
          event.preventDefault();
          event.stopPropagation();

          setTimeout(() => {
            UiUtils.getActiveQueryBoxTextarea().trigger("focus");
          }, 100);
        }
      }}
    >
      <SelectTrigger variant="noStyle" className="x-m-0 x-p-0">
        <BetterLanguageModelSelectorTriggerButton />
      </SelectTrigger>
      {isMobile ? (
        <SelectContext>
          {({ open, setOpen }) => (
            <MobileContent
              open={open}
              setHighlightedItem={setHighlightedItem}
              onOpenChange={({ open }) => setOpen(open)}
            />
          )}
        </SelectContext>
      ) : (
        <DesktopContent setHighlightedItem={setHighlightedItem} />
      )}
    </Select>
  );
}
