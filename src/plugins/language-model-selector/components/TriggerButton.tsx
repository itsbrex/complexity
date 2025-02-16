import { type ComponentType, type SVGProps } from "react";
import { LuCpu } from "react-icons/lu";

import FaAtom from "@/components/icons/FaAtom";
import FaLightBulbOn from "@/components/icons/FaLightBulbOn";
import ProSearchIcon from "@/components/icons/ProSearchIcon";
import Tooltip from "@/components/Tooltip";
import { languageModels } from "@/data/plugins/query-box/language-model-selector/language-models";
import { languageModelProviderIcons } from "@/data/plugins/query-box/language-model-selector/language-models-icons";
import { isReasoningLanguageModelCode } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { useSharedQueryBoxStore } from "@/plugins/_core/ui-groups/query-box/shared-store";

export default function BetterLanguageModelSelectorTriggerButton() {
  const { isMobile } = useIsMobileStore();

  const isProSearchEnabled = useSharedQueryBoxStore(
    (state) => state.isProSearchEnabled,
  );
  const selectedLanguageModel = useSharedQueryBoxStore(
    (state) => state.selectedLanguageModel,
  );

  const isReasoningModel = useMemo(
    () => isReasoningLanguageModelCode(selectedLanguageModel),
    [selectedLanguageModel],
  );

  const modelInfo = useMemo(
    () => languageModels.find((m) => m.code === selectedLanguageModel),
    [selectedLanguageModel],
  );

  const label = useMemo(() => {
    const fragments = [];
    if (isProSearchEnabled && !isReasoningModel && !isMobile)
      fragments.push("Pro");
    if (selectedLanguageModel !== "pplx_alpha" && isReasoningModel && !isMobile)
      fragments.push("Reasoning");
    fragments.push(modelInfo?.shortLabel);
    return fragments.join(" · ");
  }, [
    isProSearchEnabled,
    isReasoningModel,
    isMobile,
    selectedLanguageModel,
    modelInfo?.shortLabel,
  ]);

  const Icon = useMemo(() => {
    if (selectedLanguageModel === "pplx_alpha") return FaAtom;

    return isReasoningModel
      ? FaLightBulbOn
      : isProSearchEnabled
        ? ProSearchIcon
        : ((modelInfo?.provider != null
            ? languageModelProviderIcons[modelInfo.provider]
            : LuCpu) as ComponentType<SVGProps<SVGSVGElement>>);
  }, [
    selectedLanguageModel,
    isReasoningModel,
    isProSearchEnabled,
    modelInfo?.provider,
  ]);

  const className = useMemo(
    () =>
      cn(
        "x-flex x-h-8 x-items-center x-gap-2 x-rounded-md x-border x-border-transparent x-px-2 x-text-sm x-font-medium x-text-muted-foreground x-transition-all active:x-scale-95",
        {
          "x-border-primary/30 x-bg-primary/10 x-text-primary":
            isProSearchEnabled,
          "x-border-border/50 hover:x-bg-primary-foreground hover:x-text-foreground":
            !isProSearchEnabled,
        },
      ),
    [isProSearchEnabled],
  );

  return (
    <Tooltip
      content={t("plugin-model-selectors:languageModelSelector.tooltip")}
    >
      <div className={className}>
        <Icon className="x-size-4 x-shrink-0" />
        <span className="x-truncate">{label}</span>
      </div>
    </Tooltip>
  );
}
