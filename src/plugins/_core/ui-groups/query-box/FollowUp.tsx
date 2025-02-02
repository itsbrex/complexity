import CsUiPluginsGuard from "@/components/plugins-guard/CsUiPluginsGuard";
import { Portal } from "@/components/ui/portal";
import { useGlobalDomObserverStore } from "@/plugins/_api/dom-observer/global-dom-observer-store";
import { ScopedQueryBoxContextProvider } from "@/plugins/_core/ui-groups/query-box/context/context";
import { useFindToolbarPortalContainer } from "@/plugins/_core/ui-groups/query-box/hooks/useFindPortalContainer";
import SourcesToggle from "@/plugins/better-focus-selector/SourcesToggle";
import FocusWebRecencySelectorFollowUpWrapper from "@/plugins/focus-web-recency/FollowUpWrapper";
import BetterLanguageModelSelectorWrapper from "@/plugins/language-model-selector";
import SlashCommandMenuWrapper from "@/plugins/slash-command-menu";
import SlashCommandMenuTriggerButton from "@/plugins/slash-command-menu/TriggerButton";

export default function FollowUpQueryBoxWrapper() {
  const followUpQueryBox = useGlobalDomObserverStore(
    (state) => state.queryBoxes.followUpQueryBox,
  );

  const portalContainer = useFindToolbarPortalContainer(
    followUpQueryBox,
    "follow-up",
  );

  return (
    <ScopedQueryBoxContextProvider storeValue={{ type: "follow-up" }}>
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
            <SourcesToggle />
          </CsUiPluginsGuard>
          <CsUiPluginsGuard
            desktopOnly
            allowedAccountTypes={[["free"], ["pro"]]}
            dependentPluginIds={["queryBox:focusSelector:webRecency"]}
          >
            <FocusWebRecencySelectorFollowUpWrapper />
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
          <SlashCommandMenuWrapper anchor={followUpQueryBox} />
        </CsUiPluginsGuard>
      </Portal>
    </ScopedQueryBoxContextProvider>
  );
}
