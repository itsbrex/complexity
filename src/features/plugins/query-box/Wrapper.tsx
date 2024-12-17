import CsUiPluginsGuard from "@/components/CsUiPluginsGuard";
import { Portal } from "@/components/ui/portal";
import { useSpaRouter } from "@/features/plugins/_core/spa-router/listeners";
import followUpQueryBoxCss from "@/features/plugins/query-box/assets/follow-up-query-box.css?inline";
import mainQueryBoxCss from "@/features/plugins/query-box/assets/main-query-box.css?inline";
import {
  QueryBoxContextProvider,
  ScopedQueryBoxContext,
} from "@/features/plugins/query-box/context";
import LanguageModelSelector from "@/features/plugins/query-box/language-model-selector/LanguageModelSelector";
import {
  followUpQueryBoxStore,
  mainQueryBoxStore,
  modalQueryBoxStore,
  spaceQueryBoxStore,
} from "@/features/plugins/query-box/scoped-store";
import SpaceNavigator from "@/features/plugins/query-box/space-navigator/SpaceNavigator";
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
      <QueryBoxContextProvider store={mainQueryBoxStore}>
        <Portal container={mainQueryBoxPortalContainer}>
          <Toolbar />
        </Portal>
      </QueryBoxContextProvider>

      <QueryBoxContextProvider store={modalQueryBoxStore}>
        <Portal container={mainModalQueryBoxPortalContainer}>
          <Toolbar />
        </Portal>
      </QueryBoxContextProvider>

      <QueryBoxContextProvider store={spaceQueryBoxStore}>
        <Portal container={spaceQueryBoxPortalContainer}>
          <Toolbar />
        </Portal>
      </QueryBoxContextProvider>

      <Portal container={followUpQueryBoxPortalContainer}>
        <QueryBoxContextProvider store={followUpQueryBoxStore}>
          <Toolbar />
        </QueryBoxContextProvider>
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
  const ctx = use(ScopedQueryBoxContext);

  if (!ctx) throw new Error("Toolbar must be used within a QueryBoxContext");

  const settings = ExtensionLocalStorageService.getCachedSync();

  return (
    <div className="tw-flex tw-flex-wrap tw-items-center md:tw-flex-nowrap">
      {(ctx.type === "main" || ctx.type === "space") && (
        <CsUiPluginsGuard
          requiresLoggedIn
          dependentPluginIds={["queryBox:spaceNavigator"]}
        >
          <SpaceNavigator />
        </CsUiPluginsGuard>
      )}
      <CsUiPluginsGuard
        requiresPplxPro
        dependentPluginIds={["queryBox:languageModelSelector"]}
      >
        {(ctx.type === "main" ||
          ctx.type === "space" ||
          ctx.type === "modal") &&
          settings?.plugins["queryBox:languageModelSelector"].main && (
            <LanguageModelSelector />
          )}
        {ctx.type === "follow-up" &&
          settings?.plugins["queryBox:languageModelSelector"].followUp
            .enabled && <LanguageModelSelector />}
      </CsUiPluginsGuard>
    </div>
  );
}
