import { createListCollection, SelectContext } from "@ark-ui/react";
import { LuCpu as Cpu, LuInfinity } from "react-icons/lu";
import { useImmer } from "use-immer";

import Tooltip from "@/components/Tooltip";
import { DialogProps } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  getGroupedLanguageModelsByProvider,
  languageModels,
} from "@/data/plugins/query-box/language-model-selector/language-models";
import { languageModelProviderIcons } from "@/data/plugins/query-box/language-model-selector/language-models-icons";
import { LanguageModel } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { useSharedQueryBoxStore } from "@/features/plugins/query-box/shared-store";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import usePplxUserSettings from "@/hooks/usePplxUserSettings";
import { isReactNode } from "@/types/utils.types";
import { TEST_ID_SELECTORS } from "@/utils/dom-selectors";
import UiUtils from "@/utils/UiUtils";

export default function LanguageModelSelector() {
  const { isMobile } = useIsMobileStore();

  const value = useSharedQueryBoxStore((state) => state.selectedLanguageModel);
  const setValue = useSharedQueryBoxStore(
    (state) => state.setSelectedLanguageModel,
  );

  const modelsLimits = useModelLimits();

  const handleValueChange = (details: { value: LanguageModel["code"][] }) => {
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

function ModelTrigger({
  value,
  limit,
}: {
  value: string;
  limit: number | undefined;
}) {
  return (
    <div className="tw-flex tw-min-h-8 tw-items-center tw-justify-center tw-gap-1">
      <Cpu className="tw-size-4" />
      <SelectValue>
        {languageModels.find((model) => model.code === value)?.shortLabel}
      </SelectValue>
      {limit != null && limit <= 100 && (
        <span className="tw-self-start tw-text-[.5rem] tw-text-primary">
          {limit}
        </span>
      )}
    </div>
  );
}

function DesktopSelectContent() {
  const modelsLimits = useModelLimits();

  const groupedLanguageModelsByProvider = useMemo(() => {
    return getGroupedLanguageModelsByProvider();
  }, []);

  return (
    <SelectContent className="custom-scrollbar tw-max-h-[40svh] tw-max-w-[200px] tw-overflow-auto tw-font-sans">
      {groupedLanguageModelsByProvider.map(({ provider, models }) => (
        <SelectGroup key={provider}>
          <SelectLabel>{provider}</SelectLabel>
          {models.map((model) => {
            const Icon = languageModelProviderIcons[provider];

            return (
              <Tooltip
                key={model.code}
                content={
                  modelsLimits[model.code] === 9999 ? (
                    <LuInfinity />
                  ) : (
                    modelsLimits[model.code]
                  )
                }
                positioning={{ placement: "right", gutter: 10 }}
              >
                <SelectItem key={model.code} item={model.code}>
                  <div className="tw-flex tw-max-w-full tw-items-center tw-justify-around tw-gap-2">
                    {Icon != null ? (
                      <Icon className="tw-size-4" />
                    ) : (
                      <Cpu className="tw-size-4" />
                    )}
                    <span className="tw-truncate">{model.label}</span>
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

function MobileSelectContent({ ...props }: DialogProps) {
  const modelsLimits = useModelLimits();

  const groupedLanguageModelsByProvider = useMemo(() => {
    return getGroupedLanguageModelsByProvider();
  }, []);

  return (
    <Sheet unmountOnExit {...props}>
      <SheetContent side="bottom" className="tw-space-y-6">
        {groupedLanguageModelsByProvider.map(({ provider, models }) => (
          <SelectGroup key={provider} className="tw-space-y-3">
            <SelectLabel className="tw-text-lg">{provider}</SelectLabel>

            {models.map((model) => {
              const Icon = languageModelProviderIcons[provider];

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
                        <Cpu className="tw-size-5" />
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

function useModelLimits() {
  const { data } = usePplxUserSettings();

  const getModelLimit = useCallback(
    (model: LanguageModel) => {
      switch (model.code) {
        case "claude3opus":
          return data?.opus_limit ?? 0;
        case "o1":
          return data?.o1_limit ?? 0;
        case "turbo":
          return 9999;
        default:
          return data?.gpt4_limit ?? 0;
      }
    },
    [data],
  );

  const [modelsLimits, setModelsLimits] = useImmer<
    Partial<Record<LanguageModel["code"], number>>
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
