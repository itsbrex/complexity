import CsUiPluginsGuard from "@/components/CsUiPluginsGuard";
import { Portal } from "@/components/ui/portal";
import { useGlobalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import LanguageModelSelector from "@/features/plugins/query-box/language-model-selector/LanguageModelSelector";
import SlashCommandMenuTriggerButton from "@/features/plugins/query-box/prompt-history/TriggerButton";
import SlashCommandMenuWrapper from "@/features/plugins/query-box/slash-command-menu/Wrapper";
import { findToolbarPortalContainer } from "@/features/plugins/query-box/utils";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";

export default function FollowUpQueryBoxWrapper() {
  const settings = ExtensionLocalStorageService.getCachedSync();

  const followUpQueryBox = useGlobalDomObserverStore(
    (state) => state.queryBoxes.followUpQueryBox,
  );

  const followUpQueryBoxToolbarPortalContainer =
    findToolbarPortalContainer(followUpQueryBox);

  return (
    <Portal container={followUpQueryBoxToolbarPortalContainer}>
      <div className="tw-flex tw-flex-wrap tw-items-center md:tw-flex-nowrap">
        <CsUiPluginsGuard
          desktopOnly
          dependentPluginIds={["queryBox:slashCommandMenu:promptHistory"]}
          additionalCheck={(props) =>
            props.settings.plugins["queryBox:slashCommandMenu:promptHistory"]
              .showTriggerButton
          }
        >
          <SlashCommandMenuTriggerButton />
        </CsUiPluginsGuard>
        <CsUiPluginsGuard
          allowedAccountTypes={["pro", "enterprise"]}
          dependentPluginIds={["queryBox:languageModelSelector"]}
        >
          {settings?.plugins["queryBox:languageModelSelector"].followUp
            .enabled && <LanguageModelSelector />}
        </CsUiPluginsGuard>
      </div>
      <CsUiPluginsGuard
        desktopOnly
        dependentPluginIds={["queryBox:slashCommandMenu:promptHistory"]}
      >
        <SlashCommandMenuWrapper anchor={followUpQueryBox} type="follow-up" />
      </CsUiPluginsGuard>
    </Portal>
  );
}
