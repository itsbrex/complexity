import BetterThreadMessageToolbarsPluginDetails from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content//BetterThreadMessageToolbars";
import CollapseEmptyThreadVisualColsPluginDetails from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content//CollapseEmptyThreadVisualCols";
import CustomHomeSloganPluginDetails from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content//CustomHomeSlogan";
import ImageGenModelSelectorPluginDetails from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content//ImageGenModelSelector";
import LanguageModelSelectorPluginDetails from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content//LanguageModelSelector";
import NoFileCreationOnPastePluginDetails from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content//NoFileCreationOnPaste";
import OnCloudflareTimeoutAutoReloadPluginDetails from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content//OnCloudflareTimeoutAutoReload";
import BetterCodeBlocksPluginDetails from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content/better-code-blocks/BetterCodeBlocks";
import BetterThreadMessageCopyButtonsPluginDetails from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content/BetterThreadMessageCopyButtons";
import CanvasPluginDetails from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content/Canvas";
import CommandMenuPluginDetails from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content/CommandMenu";
import CustomThreadContainerWidthPluginDetails from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content/CustomThreadContainerWidth";
import ExportThreadPluginDetails from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content/ExportThread";
import FocusSelectorPluginDetails from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content/FocusSelector";
import FocusWebRecencySelectorPluginDetails from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content/FocusWebRecencySelector";
import FullWidthFollowUpQueryBoxPluginDetails from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content/FullWidthFollowUpQueryBox";
import PromptHistoryPluginDetails from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content/PromptHistory";
import SpaceNavigatorPluginDetails from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content/SpaceNavigator";
import SubmitOnCtrlEnterPluginDetails from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content/SubmitOnCtrlEnterPluginDetails";
import ThreadToCPluginDetails from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content/ThreadToC";
import ZenModePluginDetails from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content/ZenMode";
import { PluginId } from "@/services/extension-local-storage/plugins.types";

export type PluginPluginDetails = Partial<Record<PluginId, React.ReactNode>>;

export const PLUGIN_DETAILS: PluginPluginDetails = {
  "queryBox:languageModelSelector": <LanguageModelSelectorPluginDetails />,
  "queryBox:focusSelector": <FocusSelectorPluginDetails />,
  "queryBox:focusSelector:webRecency": <FocusWebRecencySelectorPluginDetails />,
  spaceNavigator: <SpaceNavigatorPluginDetails />,
  "queryBox:slashCommandMenu:promptHistory": <PromptHistoryPluginDetails />,
  "queryBox:fullWidthFollowUp": <FullWidthFollowUpQueryBoxPluginDetails />,
  "queryBox:noFileCreationOnPaste": <NoFileCreationOnPastePluginDetails />,
  "queryBox:submitOnCtrlEnter": <SubmitOnCtrlEnterPluginDetails />,
  commandMenu: <CommandMenuPluginDetails />,
  "thread:betterMessageToolbars": <BetterThreadMessageToolbarsPluginDetails />,
  "thread:betterCodeBlocks": <BetterCodeBlocksPluginDetails />,
  "thread:toc": <ThreadToCPluginDetails />,
  "thread:canvas": <CanvasPluginDetails />,
  "thread:exportThread": <ExportThreadPluginDetails />,
  "thread:betterMessageCopyButtons": (
    <BetterThreadMessageCopyButtonsPluginDetails />
  ),
  "thread:collapseEmptyThreadVisualCols": (
    <CollapseEmptyThreadVisualColsPluginDetails />
  ),
  "thread:customThreadContainerWidth": (
    <CustomThreadContainerWidthPluginDetails />
  ),
  imageGenModelSelector: <ImageGenModelSelectorPluginDetails />,
  onCloudflareTimeoutAutoReload: <OnCloudflareTimeoutAutoReloadPluginDetails />,
  "home:customSlogan": <CustomHomeSloganPluginDetails />,
  zenMode: <ZenModePluginDetails />,
};
