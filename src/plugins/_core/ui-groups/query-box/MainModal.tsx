import CsUiPluginsGuard from "@/components/plugins-guard/CsUiPluginsGuard";
import { Portal } from "@/components/ui/portal";
import { useGlobalDomObserverStore } from "@/plugins/_api/dom-observer/global-dom-observer-store";
import { ScopedQueryBoxContextProvider } from "@/plugins/_core/ui-groups/query-box/context/context";
import { useFindToolbarPortalContainer } from "@/plugins/_core/ui-groups/query-box/hooks/useFindPortalContainer";
import FocusSelectorWrapper from "@/plugins/better-focus-selector";
import FocusWebRecencySelectorMainWrapper from "@/plugins/focus-web-recency/MainWrapper";
import BetterLanguageModelSelectorWrapper from "@/plugins/language-model-selector";
import SlashCommandMenuWrapper from "@/plugins/slash-command-menu";
import SlashCommandMenuTriggerButton from "@/plugins/slash-command-menu/TriggerButton";

export default function MainModalQueryBoxWrapper() {
  const mainModalQueryBox = useGlobalDomObserverStore(
    (state) => state.queryBoxes.mainModalQueryBox,
  );

  const portalContainer = useFindToolbarPortalContainer(
    mainModalQueryBox,
    "main-modal",
  );

  return (
    <ScopedQueryBoxContextProvider storeValue={{ type: "main-modal" }}>
      <Portal container={portalContainer}>
        <div className="x-flex x-flex-wrap x-items-center x-gap-1">
          <CsUiPluginsGuard
            allowedAccountTypes={[["pro"], ["pro", "enterprise"]]}
            dependentPluginIds={["queryBox:languageModelSelector"]}
          >
            <BetterLanguageModelSelectorWrapper />
          </CsUiPluginsGuard>
          <CsUiPluginsGuard
            allowedAccountTypes={[["free"], ["pro"]]}
            dependentPluginIds={["queryBox:focusSelector"]}
          >
            <FocusSelectorWrapper />
          </CsUiPluginsGuard>
          <CsUiPluginsGuard
            allowedAccountTypes={[["free"], ["pro"]]}
            dependentPluginIds={["queryBox:focusSelector:webRecency"]}
          >
            <FocusWebRecencySelectorMainWrapper />
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
        </div>
        <CsUiPluginsGuard
          desktopOnly
          dependentPluginIds={["queryBox:slashCommandMenu"]}
        >
          <SlashCommandMenuWrapper anchor={mainModalQueryBox} />
        </CsUiPluginsGuard>
      </Portal>
    </ScopedQueryBoxContextProvider>
  );
}
