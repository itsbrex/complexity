import { useSpaRouter } from "@/features/plugins/_core/spa-router/listeners";
import followUpQueryBoxCss from "@/features/plugins/query-box/follow-up-query-box.css?inline";
import FollowUpQueryBoxWrapper from "@/features/plugins/query-box/FollowUp";
import MainQueryBoxWrapper from "@/features/plugins/query-box/Main";
import mainQueryBoxCss from "@/features/plugins/query-box/main-query-box.css?inline";
import MainModalQueryBoxWrapper from "@/features/plugins/query-box/MainModal";
import SpaceQueryBoxWrapper from "@/features/plugins/query-box/Space";
import { useInsertCss } from "@/hooks/useInsertCss";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";
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

  const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

  const settings = ExtensionLocalStorageService.getCachedSync();

  const shouldInjectMain =
    settings?.plugins["queryBox:languageModelSelector"].main &&
    (pluginsEnableStates?.["queryBox:languageModelSelector"] ||
      pluginsEnableStates?.["queryBox:spaceNavigator"] ||
      (pluginsEnableStates?.["queryBox:slashCommandMenu:promptHistory"] &&
        settings?.plugins["queryBox:slashCommandMenu:promptHistory"]
          .showTriggerButton));

  const shouldInjectFollowUp =
    location === "thread" &&
    settings?.plugins["queryBox:languageModelSelector"].followUp &&
    (pluginsEnableStates?.["queryBox:languageModelSelector"] ||
      (pluginsEnableStates?.["queryBox:slashCommandMenu:promptHistory"] &&
        settings?.plugins["queryBox:slashCommandMenu:promptHistory"]
          .showTriggerButton));

  useInsertCss({
    id: "cplx-main-query-box",
    css: mainQueryBoxCss,
    inject: shouldInjectMain,
  });
  useInsertCss({
    id: "cplx-follow-up-query-box",
    css: followUpQueryBoxCss,
    inject: shouldInjectFollowUp,
  });
}
