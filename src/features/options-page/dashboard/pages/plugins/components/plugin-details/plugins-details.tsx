import BetterThreadMessageToolbarsPluginDetails from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content//BetterThreadMessageToolbars";
import CollapseEmptyThreadVisualColsPluginDetails from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content//CollapseEmptyThreadVisualCols";
import CustomHomeSloganPluginDetails from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content//CustomHomeSlogan";
import ImageGenModelSelectorPluginDetails from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content//ImageGenModelSelector";
import LanguageModelSelectorPluginDetails from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content//LanguageModelSelector";
import NoFileCreationOnPastePluginDetails from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content//NoFileCreationOnPaste";
import OnCloudflareTimeoutAutoReloadPluginDetails from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content//OnCloudflareTimeoutAutoReload";
import BetterCodeBlocksPluginDetails from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content/BetterCodeBlocks";
import { PluginId } from "@/services/extension-local-storage/plugins.types";

export type PluginPluginDetails = Partial<Record<PluginId, React.ReactNode>>;

export const PLUGIN_DETAILS: PluginPluginDetails = {
  "queryBox:languageModelSelector": <LanguageModelSelectorPluginDetails />,
  "queryBox:noFileCreationOnPaste": <NoFileCreationOnPastePluginDetails />,
  "thread:betterMessageToolbars": <BetterThreadMessageToolbarsPluginDetails />,
  "thread:betterCodeBlocks": <BetterCodeBlocksPluginDetails />,
  "thread:collapseEmptyThreadVisualCols": (
    <CollapseEmptyThreadVisualColsPluginDetails />
  ),
  imageGenModelSelector: <ImageGenModelSelectorPluginDetails />,
  onCloudflareTimeoutAutoReload: <OnCloudflareTimeoutAutoReloadPluginDetails />,
  "home:customSlogan": <CustomHomeSloganPluginDetails />,
};
