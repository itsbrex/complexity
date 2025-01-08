import CsUiPluginsGuard from "@/components/CsUiPluginsGuard";
import { Portal } from "@/components/ui/portal";
import { useGlobalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { ScopedQueryBoxContextProvider } from "@/features/plugins/query-box/context/context";
import FocusSelectorWrapper from "@/features/plugins/query-box/focus-selector/Wrapper";
import FocusWebRecencySelectorMainWrapper from "@/features/plugins/query-box/focus-web-recency/MainWrapper";
import LanguageModelSelector from "@/features/plugins/query-box/language-model-selector/LanguageModelSelector";
import SlashCommandMenuTriggerButton from "@/features/plugins/query-box/prompt-history/TriggerButton";
import SlashCommandMenuWrapper from "@/features/plugins/query-box/slash-command-menu/Wrapper";
import { findToolbarPortalContainer } from "@/features/plugins/query-box/utils";

export default function MainModalQueryBoxWrapper() {
  const mainModalQueryBox = useGlobalDomObserverStore(
    (state) => state.queryBoxes.mainModalQueryBox,
  );

  const mainModalQueryBoxToolbarPortalContainer =
    findToolbarPortalContainer(mainModalQueryBox);

  return (
    <ScopedQueryBoxContextProvider storeValue={{ type: "main-modal" }}>
      <Portal container={mainModalQueryBoxToolbarPortalContainer}>
        <div className="tw-flex tw-flex-wrap tw-items-center md:tw-flex-nowrap">
          <CsUiPluginsGuard
            allowedAccountTypes={["free", "pro"]}
            dependentPluginIds={["queryBox:focusSelector"]}
          >
            <FocusSelectorWrapper />
          </CsUiPluginsGuard>
          <CsUiPluginsGuard
            allowedAccountTypes={["free", "pro"]}
            dependentPluginIds={["queryBox:focusSelector:webRecency"]}
          >
            <FocusWebRecencySelectorMainWrapper />
          </CsUiPluginsGuard>

          <CsUiPluginsGuard
            desktopOnly
            dependentPluginIds={["queryBox:slashCommandMenu:promptHistory"]}
            additionalCheck={({ settings }) =>
              settings?.plugins["queryBox:slashCommandMenu:promptHistory"]
                .showTriggerButton
            }
          >
            <SlashCommandMenuTriggerButton />
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
          <SlashCommandMenuWrapper anchor={mainModalQueryBox} />
        </CsUiPluginsGuard>
      </Portal>
    </ScopedQueryBoxContextProvider>
  );
}
