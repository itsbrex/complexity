import { createListCollection, SelectContext } from "@ark-ui/react";
import { useQuery } from "@tanstack/react-query";

import Tooltip from "@/components/Tooltip";
import { Select, SelectTrigger } from "@/components/ui/select";
import { languageModels } from "@/data/plugins/query-box/language-model-selector/language-models";
import { isLanguageModelCode } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { useSpaRouter } from "@/features/plugins/_core/spa-router/listeners";
import { DesktopSelectContent } from "@/features/plugins/query-box/language-model-selector/components/DesktopSelectContent";
import { MobileSelectContent } from "@/features/plugins/query-box/language-model-selector/components/MobileSelectContent";
import { ModelTrigger } from "@/features/plugins/query-box/language-model-selector/components/ModelTrigger";
import { useSharedQueryBoxStore } from "@/features/plugins/query-box/shared-store";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import { TEST_ID_SELECTORS } from "@/utils/dom-selectors";
import UiUtils from "@/utils/UiUtils";
import { parseUrl } from "@/utils/utils";

export default function LanguageModelSelector() {
  const { isMobile } = useIsMobileStore();

  const value = useSharedQueryBoxStore((state) => state.selectedLanguageModel);
  const setValue = useSharedQueryBoxStore(
    (state) => state.setSelectedLanguageModel,
  );

  const handleValueChange = (details: { value: string[] }) => {
    if (details.value[0] == null) return;

    setValue(details.value[0]);
    setTimeout(() => {
      UiUtils.getActiveQueryBoxTextarea().trigger("focus");
    }, 100);
  };

  const settings = ExtensionLocalStorageService.getCachedSync();

  const { data: spaces } = useQuery({
    ...pplxApiQueries.spaces,
    enabled:
      settings.plugins["queryBox:languageModelSelector"]
        .respectDefaultSpaceModel,
  });

  const url = useSpaRouter((state) => state.url);
  const spaceSlug = parseUrl(url).pathname.split("/").pop();

  useEffect(() => {
    if (!spaces) return;

    const space = spaces.find(
      (space) => space.slug === spaceSlug || space.uuid === spaceSlug,
    );

    const modelCode = space?.model_selection;

    if (modelCode == null || !isLanguageModelCode(modelCode)) return;

    setValue(modelCode);
  }, [setValue, spaceSlug, spaces]);

  return (
    <Select
      lazyMount
      unmountOnExit
      portal={false}
      data-testid={TEST_ID_SELECTORS.QUERY_BOX.LANGUAGE_MODEL_SELECTOR}
      collection={createListCollection({
        items: languageModels.map((model) => model.code),
      })}
      value={[value]}
      onValueChange={handleValueChange}
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
      <Tooltip
        content={t("plugin-model-selectors:languageModelSelector.tooltip")}
        positioning={{ gutter: 8 }}
      >
        <SelectTrigger variant="ghost">
          <ModelTrigger value={value} />
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
