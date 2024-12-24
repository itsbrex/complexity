import CsUiPluginsGuard from "@/components/CsUiPluginsGuard";
import { Portal } from "@/components/ui/portal";
import { useGlobalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import LanguageModelSelector from "@/features/plugins/query-box/language-model-selector/LanguageModelSelector";
import SlashCommandMenuWrapper from "@/features/plugins/query-box/slash-command-menu/Wrapper";
import SpaceNavigator from "@/features/plugins/query-box/space-navigator/SpaceNavigator";
import { findToolbarPortalContainer } from "@/features/plugins/query-box/utils";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";

export default function MainQueryBoxWrapper() {
  const settings = ExtensionLocalStorageService.getCachedSync();

  const mainQueryBox = useGlobalDomObserverStore(
    (state) => state.queryBoxes.mainQueryBox,
  );

  const mainQueryBoxToolbarPortalContainer =
    findToolbarPortalContainer(mainQueryBox);

  return (
    <>
      <Portal container={mainQueryBoxToolbarPortalContainer}>
        <div className="tw-flex tw-flex-wrap tw-items-center md:tw-flex-nowrap">
          <CsUiPluginsGuard
            requiresLoggedIn
            dependentPluginIds={["queryBox:spaceNavigator"]}
          >
            <SpaceNavigator />
          </CsUiPluginsGuard>
          <CsUiPluginsGuard
            requiresPplxPro
            dependentPluginIds={["queryBox:languageModelSelector"]}
          >
            {settings?.plugins["queryBox:languageModelSelector"].main && (
              <LanguageModelSelector />
            )}
          </CsUiPluginsGuard>
        </div>
      </Portal>
      <CsUiPluginsGuard
        desktopOnly
        dependentPluginIds={["queryBox:slashCommandMenu:promptHistory"]}
      >
        <SlashCommandMenuWrapper anchor={mainQueryBox} />
      </CsUiPluginsGuard>
    </>
  );
}
