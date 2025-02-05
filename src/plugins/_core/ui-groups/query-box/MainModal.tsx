import CsUiPluginsGuard from "@/components/plugins-guard/CsUiPluginsGuard";
import { Portal } from "@/components/ui/portal";
import { useGlobalDomObserverStore } from "@/plugins/_api/dom-observer/global-dom-observer-store";
import { ScopedQueryBoxContextProvider } from "@/plugins/_core/ui-groups/query-box/context/context";
import { findToolbarPortalContainer } from "@/plugins/_core/ui-groups/query-box/utils";
import BetterLanguageModelSelectorWrapper from "@/plugins/language-model-selector";
import SlashCommandMenuWrapper from "@/plugins/slash-command-menu";
import SlashCommandMenuTriggerButton from "@/plugins/slash-command-menu/TriggerButton";

export default function MainModalQueryBoxWrapper() {
  const mainModalQueryBox = useGlobalDomObserverStore(
    (state) => state.queryBoxes.mainModalQueryBox,
  );

  if (!mainModalQueryBox) return null;

  const { leftContainer, rightContainer } =
    findToolbarPortalContainer(mainModalQueryBox);

  return (
    <ScopedQueryBoxContextProvider storeValue={{ type: "main-modal" }}>
      <Portal container={leftContainer}>
        <CsUiPluginsGuard
          allowedAccountTypes={[["pro"], ["pro", "enterprise"]]}
          dependentPluginIds={["queryBox:languageModelSelector"]}
        >
          <BetterLanguageModelSelectorWrapper />
        </CsUiPluginsGuard>
      </Portal>
      <Portal container={rightContainer}>
        <div className="x-flex x-flex-wrap x-items-center x-gap-1">
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
