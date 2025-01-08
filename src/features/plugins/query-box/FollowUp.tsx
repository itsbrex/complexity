import CsUiPluginsGuard from "@/components/CsUiPluginsGuard";
import { Portal } from "@/components/ui/portal";
import { useGlobalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { ScopedQueryBoxContextProvider } from "@/features/plugins/query-box/context/context";
import FocusWebRecencySelectorFollowUpWrapper from "@/features/plugins/query-box/focus-web-recency/FollowUpWrapper";
import LanguageModelSelector from "@/features/plugins/query-box/language-model-selector/LanguageModelSelector";
import SlashCommandMenuTriggerButton from "@/features/plugins/query-box/prompt-history/TriggerButton";
import SlashCommandMenuWrapper from "@/features/plugins/query-box/slash-command-menu/Wrapper";
import { findToolbarPortalContainer } from "@/features/plugins/query-box/utils";

export default function FollowUpQueryBoxWrapper() {
  const followUpQueryBox = useGlobalDomObserverStore(
    (state) => state.queryBoxes.followUpQueryBox,
  );

  const followUpQueryBoxToolbarPortalContainer =
    findToolbarPortalContainer(followUpQueryBox);

  return (
    <ScopedQueryBoxContextProvider storeValue={{ type: "follow-up" }}>
      <Portal container={followUpQueryBoxToolbarPortalContainer}>
        <div className="tw-flex tw-flex-wrap tw-items-center md:tw-flex-nowrap">
          <CsUiPluginsGuard
            desktopOnly
            allowedAccountTypes={["free", "pro"]}
            dependentPluginIds={["queryBox:focusSelector:webRecency"]}
          >
            <FocusWebRecencySelectorFollowUpWrapper />
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
              settings?.plugins["queryBox:languageModelSelector"].followUp
            }
          >
            <LanguageModelSelector />
          </CsUiPluginsGuard>
        </div>
        <CsUiPluginsGuard
          desktopOnly
          dependentPluginIds={["queryBox:slashCommandMenu:promptHistory"]}
        >
          <SlashCommandMenuWrapper anchor={followUpQueryBox} />
        </CsUiPluginsGuard>
      </Portal>
    </ScopedQueryBoxContextProvider>
  );
}
