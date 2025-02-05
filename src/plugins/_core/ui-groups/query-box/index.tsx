import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { useInsertCss } from "@/hooks/useInsertCss";
import { useSpaRouter } from "@/plugins/_api/spa-router/listeners";
import followUpQueryBoxCss from "@/plugins/_core/ui-groups/query-box/follow-up-query-box.css?inline";
import FollowUpQueryBoxWrapper from "@/plugins/_core/ui-groups/query-box/FollowUp";
import MainQueryBoxWrapper from "@/plugins/_core/ui-groups/query-box/Main";
import mainQueryBoxCss from "@/plugins/_core/ui-groups/query-box/main-query-box.css?inline";
import MainModalQueryBoxWrapper from "@/plugins/_core/ui-groups/query-box/MainModal";
import SpaceQueryBoxWrapper from "@/plugins/_core/ui-groups/query-box/Space";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";
import { PluginsStatesService } from "@/services/plugins-states";
import { whereAmI } from "@/utils/utils";

export default function QueryBoxWrapper() {
  useInsertToolbarCss();

  return (
    <>
      <MainQueryBoxWrapper />
      <MainModalQueryBoxWrapper />
      <SpaceQueryBoxWrapper />
      <FollowUpQueryBoxWrapper />
    </>
  );
}

function useInsertToolbarCss() {
  const location = whereAmI(useSpaRouter().url);
  const { isMobile } = useIsMobileStore();

  const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

  const settings = ExtensionLocalStorageService.getCachedSync();

  const shouldInjectMain =
    pluginsEnableStates["queryBox:languageModelSelector"] ||
    pluginsEnableStates["spaceNavigator"] ||
    (pluginsEnableStates["queryBox:slashCommandMenu"] &&
      settings?.plugins["queryBox:slashCommandMenu"].showTriggerButton);

  const shouldInjectFollowUp =
    location === "thread" &&
    (pluginsEnableStates["queryBox:languageModelSelector"] ||
      (isMobile && pluginsEnableStates["spaceNavigator"]) ||
      (pluginsEnableStates["queryBox:slashCommandMenu"] &&
        settings?.plugins["queryBox:slashCommandMenu"].showTriggerButton));

  useInsertCss({
    id: "main-query-box",
    css: mainQueryBoxCss,
    inject: shouldInjectMain,
  });

  useInsertCss({
    id: "follow-up-query-box",
    css: followUpQueryBoxCss,
    inject: shouldInjectFollowUp,
  });
}
