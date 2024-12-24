import CsUiPluginsGuard from "@/components/CsUiPluginsGuard";
import { Portal } from "@/components/ui/portal";
import { useGlobalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import LanguageModelSelector from "@/features/plugins/query-box/language-model-selector/LanguageModelSelector";
import SlashCommandMenuTriggerButton from "@/features/plugins/query-box/prompt-history/TriggerButton";
import SlashCommandMenuWrapper from "@/features/plugins/query-box/slash-command-menu/Wrapper";
import { findToolbarPortalContainer } from "@/features/plugins/query-box/utils";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";

export default function MainModalQueryBoxWrapper() {
  const settings = ExtensionLocalStorageService.getCachedSync();

  const mainModalQueryBox = useGlobalDomObserverStore(
    (state) => state.queryBoxes.mainModalQueryBox,
  );

  const mainModalQueryBoxToolbarPortalContainer =
    findToolbarPortalContainer(mainModalQueryBox);

  return (
    <>
      <Portal container={mainModalQueryBoxToolbarPortalContainer}>
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
        <SlashCommandMenuWrapper anchor={mainModalQueryBox} type="main-modal" />
      </CsUiPluginsGuard>
    </>
  );
}
