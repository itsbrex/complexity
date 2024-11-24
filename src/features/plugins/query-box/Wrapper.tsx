import CsUiPluginsGuard from "@/components/CsUiPluginsGuard";
import { Portal } from "@/components/ui/portal";
import { useSpaRouter } from "@/features/plugins/_core/spa-router/listeners";
import followUpQueryBoxCss from "@/features/plugins/query-box/assets/follow-up-query-box.css?inline";
import mainQueryBoxCss from "@/features/plugins/query-box/assets/main-query-box.css?inline";
import {
  FollowUpQueryBoxContextProvider,
  MainQueryBoxContextProvider,
  ScopedQueryBoxContext,
} from "@/features/plugins/query-box/context";
import LanguageModelSelector from "@/features/plugins/query-box/language-model-selector/LanguageModelSelector";
import useObserver from "@/features/plugins/query-box/useObserver";
import { useInsertCss } from "@/hooks/useInsertCss";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";
import { whereAmI } from "@/utils/utils";

export default function QueryBoxWrapper() {
  const {
    mainQueryBoxPortalContainer,
    mainModalQueryBoxPortalContainer,
    spaceQueryBoxPortalContainer,
    followUpQueryBoxPortalContainer,
  } = useObserver();

  useInsertToolbarCss();

  return (
    <>
      <MainQueryBoxContextProvider>
        {[
          mainQueryBoxPortalContainer,
          mainModalQueryBoxPortalContainer,
          spaceQueryBoxPortalContainer,
        ].map((container, idx) => (
          <Portal key={idx} container={container}>
            <Toolbar />
          </Portal>
        ))}
      </MainQueryBoxContextProvider>
      <Portal container={followUpQueryBoxPortalContainer}>
        <FollowUpQueryBoxContextProvider>
          <Toolbar />
        </FollowUpQueryBoxContextProvider>
      </Portal>
    </>
  );
}

function useInsertToolbarCss() {
  const location = whereAmI(useSpaRouter().url);

  const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

  const settings = ExtensionLocalStorageService.getCachedSync();

  const shouldInjectMain =
    pluginsEnableStates?.["queryBox:languageModelSelector"] &&
    settings?.plugins["queryBox:languageModelSelector"].main;

  const shouldInjectFollowUp =
    pluginsEnableStates?.["queryBox:languageModelSelector"] &&
    settings?.plugins["queryBox:languageModelSelector"].followUp.enabled &&
    location === "thread";

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

function Toolbar() {
  const ctx = useContext(ScopedQueryBoxContext);

  if (!ctx) throw new Error("Toolbar must be used within a QueryBoxContext");

  const settings = ExtensionLocalStorageService.getCachedSync();

  const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

  if (
    ctx.type === "main" &&
    !settings?.plugins["queryBox:languageModelSelector"].main
  ) {
    return null;
  }

  if (
    ctx.type === "follow-up" &&
    !settings?.plugins["queryBox:languageModelSelector"].followUp.enabled
  ) {
    return null;
  }

  return (
    <div className="tw-flex tw-flex-wrap tw-items-center tw-animate-in tw-fade-in">
      <CsUiPluginsGuard
        requiresPplxPro
        dependentPluginIds={["queryBox:languageModelSelector"]}
      >
        {pluginsEnableStates?.["queryBox:languageModelSelector"] === true && (
          <LanguageModelSelector />
        )}
      </CsUiPluginsGuard>
    </div>
  );
}
