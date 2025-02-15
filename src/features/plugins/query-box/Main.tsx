import CsUiPluginsGuard from "@/components/CsUiPluginsGuard";
import { Portal } from "@/components/ui/portal";
import { useGlobalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { ScopedQueryBoxContextProvider } from "@/features/plugins/query-box/context/context";
import FocusSelectorWrapper from "@/features/plugins/query-box/focus-selector/Wrapper";
import LanguageModelSelector from "@/features/plugins/query-box/language-model-selector/LanguageModelSelector";
import SlashCommandMenuTriggerButton from "@/features/plugins/query-box/prompt-history/TriggerButton";
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
    <ScopedQueryBoxContextProvider storeValue={{ type: "main" }}>
      <Portal container={mainQueryBoxToolbarPortalContainer}>
        <div className="tw-flex tw-flex-wrap tw-items-center md:tw-flex-nowrap">
          <CsUiPluginsGuard
            allowedAccountTypes={["free", "pro"]}
            dependentPluginIds={["queryBox:focusSelector"]}
          >
            <FocusSelectorWrapper />
          </CsUiPluginsGuard>
          <CsUiPluginsGuard
            desktopOnly
            dependentPluginIds={["queryBox:slashCommandMenu:promptHistory"]}
          >
            <SlashCommandMenuTriggerButton />
          </CsUiPluginsGuard>
          <CsUiPluginsGuard
            requiresLoggedIn
            dependentPluginIds={["queryBox:spaceNavigator"]}
          >
            <SpaceNavigator />
          </CsUiPluginsGuard>
          <CsUiPluginsGuard
            allowedAccountTypes={["pro", "enterprise"]}
            dependentPluginIds={["queryBox:languageModelSelector"]}
          >
            {settings?.plugins["queryBox:languageModelSelector"].main && (
              <LanguageModelSelector />
            )}
          </CsUiPluginsGuard>
        </div>
        <CsUiPluginsGuard
          desktopOnly
          dependentPluginIds={["queryBox:slashCommandMenu:promptHistory"]}
        >
          <SlashCommandMenuWrapper anchor={mainQueryBox} />
        </CsUiPluginsGuard>
      </Portal>
    </ScopedQueryBoxContextProvider>
  );
}
