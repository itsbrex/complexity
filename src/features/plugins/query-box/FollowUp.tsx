import CsUiPluginsGuard from "@/components/CsUiPluginsGuard";
import { Portal } from "@/components/ui/portal";
import { useGlobalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import LanguageModelSelector from "@/features/plugins/query-box/language-model-selector/LanguageModelSelector";
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
    <>
      <Portal container={followUpQueryBoxToolbarPortalContainer}>
        <div className="tw-flex tw-flex-wrap tw-items-center md:tw-flex-nowrap">
          <CsUiPluginsGuard
            requiresPplxPro
            dependentPluginIds={["queryBox:languageModelSelector"]}
          >
            {settings?.plugins["queryBox:languageModelSelector"].followUp
              .enabled && <LanguageModelSelector />}
          </CsUiPluginsGuard>
        </div>
      </Portal>
      <CsUiPluginsGuard
        desktopOnly
        dependentPluginIds={["queryBox:slashCommandMenu:promptHistory"]}
      >
        <SlashCommandMenuWrapper anchor={followUpQueryBox} type="follow-up" />
      </CsUiPluginsGuard>
    </>
  );
}
