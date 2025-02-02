import CsUiPluginsGuard from "@/components/plugins-guard/CsUiPluginsGuard";
import { Portal } from "@/components/ui/portal";
import { useGlobalDomObserverStore } from "@/plugins/_api/dom-observer/global-dom-observer-store";
import { ScopedQueryBoxContextProvider } from "@/plugins/_core/ui-groups/query-box/context/context";
import { useFindToolbarPortalContainer } from "@/plugins/_core/ui-groups/query-box/hooks/useFindPortalContainer";
import BetterLanguageModelSelectorWrapper from "@/plugins/language-model-selector";
import SlashCommandMenuWrapper from "@/plugins/slash-command-menu";
import SlashCommandMenuTriggerButton from "@/plugins/slash-command-menu/TriggerButton";
import SpaceNavigatorWrapper from "@/plugins/space-navigator/query-box";

export default function SpaceQueryBoxWrapper() {
  const spaceQueryBox = useGlobalDomObserverStore(
    (state) => state.queryBoxes.spaceQueryBox,
  );

  const portalContainer = useFindToolbarPortalContainer(spaceQueryBox, "space");

  return (
    <ScopedQueryBoxContextProvider storeValue={{ type: "space" }}>
      <Portal container={portalContainer}>
        <div className="x-flex x-flex-wrap x-items-center x-gap-1">
          <CsUiPluginsGuard
            allowedAccountTypes={[["pro"], ["pro", "enterprise"]]}
            dependentPluginIds={["queryBox:languageModelSelector"]}
          >
            <BetterLanguageModelSelectorWrapper />
          </CsUiPluginsGuard>
          <CsUiPluginsGuard
            desktopOnly
            dependentPluginIds={["queryBox:slashCommandMenu"]}
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
        </div>
        <CsUiPluginsGuard
          desktopOnly
          dependentPluginIds={["queryBox:slashCommandMenu"]}
        >
          <SlashCommandMenuWrapper anchor={spaceQueryBox} />
        </CsUiPluginsGuard>
      </Portal>
    </ScopedQueryBoxContextProvider>
  );
}
