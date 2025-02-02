import { LuCpu } from "react-icons/lu";

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

  const { isProSearchEnabled, selectedLanguageModel } =
    useSharedQueryBoxStore();

  const isReasoningModel = isReasoningLanguageModelCode(selectedLanguageModel);
  const modelInfo = languageModels.find(
    (m) => m.code === selectedLanguageModel,
  );

  const labelfragments = [];

  if (isProSearchEnabled && !isReasoningModel && !isMobile)
    labelfragments.push("Pro");

  if (isReasoningModel) labelfragments.push("Reasoning");

  labelfragments.push(modelInfo?.shortLabel);

  const label = labelfragments.join(" · ");

  const ModelIcon =
    modelInfo?.provider != null
      ? languageModelProviderIcons[modelInfo?.provider]
      : null;

  const Icon = isReasoningModel
    ? FaLightBulbOn
    : isProSearchEnabled
      ? ProSearchIcon
      : (ModelIcon ?? LuCpu);

  return (
    <Tooltip
      content={t("plugin-model-selectors:languageModelSelector.tooltip")}
    >
      <div
        className={cn(
          "x-flex x-h-8 x-items-center x-gap-2 x-rounded-md x-border x-border-transparent x-px-2 x-text-sm x-font-medium x-text-muted-foreground x-transition-all active:x-scale-95",
          {
            "x-border-primary/30 x-bg-primary/10 x-text-primary hover:x-bg-primary/10":
              isProSearchEnabled,
            "x-border-border/50 hover:x-bg-primary-foreground hover:x-text-foreground":
              !isProSearchEnabled,
          },
        )}
      >
        <Icon className="x-size-4 x-shrink-0" />
        <span className="x-truncate">{label}</span>
      </div>
    </Tooltip>
  );
}
