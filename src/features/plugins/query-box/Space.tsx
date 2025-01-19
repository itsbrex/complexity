import CsUiPluginsGuard from "@/components/CsUiPluginsGuard";
import { Portal } from "@/components/ui/portal";
import { useGlobalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { ScopedQueryBoxContextProvider } from "@/features/plugins/query-box/context/context";
import LanguageModelSelector from "@/features/plugins/query-box/language-model-selector/LanguageModelSelector";
import SlashCommandMenuTriggerButton from "@/features/plugins/query-box/slash-command-menu/TriggerButton";
import SlashCommandMenuWrapper from "@/features/plugins/query-box/slash-command-menu/Wrapper";
import SpaceNavigatorWrapper from "@/features/plugins/query-box/space-navigator/Wrapper";
import { findToolbarPortalContainer } from "@/features/plugins/query-box/utils";

export default function SpaceQueryBoxWrapper() {
  const spaceQueryBox = useGlobalDomObserverStore(
    (state) => state.queryBoxes.spaceQueryBox,
  );

  const spaceQueryBoxToolbarPortalContainer =
    findToolbarPortalContainer(spaceQueryBox);

  return (
    <ScopedQueryBoxContextProvider storeValue={{ type: "space" }}>
      <Portal container={spaceQueryBoxToolbarPortalContainer}>
        <div className="tw-flex tw-flex-wrap tw-items-center md:tw-flex-nowrap">
          <CsUiPluginsGuard
            desktopOnly
            dependentPluginIds={["queryBox:slashCommandMenu:promptHistory"]}
            additionalCheck={({ settings }) =>
              settings?.plugins["queryBox:slashCommandMenu"].showTriggerButton
            }
          >
            <SlashCommandMenuTriggerButton />
          </CsUiPluginsGuard>
          <CsUiPluginsGuard
            mobileOnly
            requiresLoggedIn
            dependentPluginIds={["spaceNavigator"]}
          >
            <SpaceNavigatorWrapper />
          </CsUiPluginsGuard>
          <CsUiPluginsGuard
            allowedAccountTypes={["pro", "enterprise"]}
            dependentPluginIds={["queryBox:languageModelSelector"]}
            additionalCheck={({ settings }) =>
              settings?.plugins["queryBox:languageModelSelector"].main
            }
          >
            <LanguageModelSelector />
          </CsUiPluginsGuard>
        </div>
        <CsUiPluginsGuard
          desktopOnly
          dependentPluginIds={["queryBox:slashCommandMenu:promptHistory"]}
        >
          <SlashCommandMenuWrapper anchor={spaceQueryBox} />
        </CsUiPluginsGuard>
      </Portal>
    </ScopedQueryBoxContextProvider>
  );
}
