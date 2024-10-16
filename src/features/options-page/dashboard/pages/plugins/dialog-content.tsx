import CollapseEmptyThreadVisualColsDialogContent from "@/features/options-page/dashboard/pages/plugins/components/dialog-content/CollapseEmptyThreadVisualColsDialogContent";
import ImageGenModelSelectorDialogContent from "@/features/options-page/dashboard/pages/plugins/components/dialog-content/ImageGenModelSelector";
import LanguageModelSelectorDialogContent from "@/features/options-page/dashboard/pages/plugins/components/dialog-content/LanguageModelSelector";
import NoFileCreationOnPasteDialogContent from "@/features/options-page/dashboard/pages/plugins/components/dialog-content/NoFileCreationOnPaste";
import OnCloudflareTimeoutAutoReloadDialogContent from "@/features/options-page/dashboard/pages/plugins/components/dialog-content/OnCloudflareTimeoutAutoReload";
import { PluginId } from "@/services/extension-local-storage/extension-local-storage.types";

export type PluginDialogContent = Partial<Record<PluginId, React.ReactNode>>;

export const PLUGIN_DIALOG_CONTENT: PluginDialogContent = {
  "queryBox:languageModelSelector": <LanguageModelSelectorDialogContent />,
  "queryBox:noFileCreationOnPaste": <NoFileCreationOnPasteDialogContent />,
  imageGenModelSelector: <ImageGenModelSelectorDialogContent />,
  onCloudflareTimeoutAutoReload: <OnCloudflareTimeoutAutoReloadDialogContent />,
  collapseEmptyThreadVisualCols: <CollapseEmptyThreadVisualColsDialogContent />,
};
