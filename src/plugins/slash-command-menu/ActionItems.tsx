import CsUiPluginsGuard from "@/components/plugins-guard/CsUiPluginsGuard";
import ChangeFocusModeActionItem from "@/plugins/slash-command-menu/components/action-items/ChangeFocusMode";
import ChangeModelActionItem from "@/plugins/slash-command-menu/components/action-items/ChangeModel";
import SearchSpacesActionItem from "@/plugins/slash-command-menu/components/action-items/SearchSpaces";

export default function ActionItems() {
  return (
    <>
      <CsUiPluginsGuard
        allowedAccountTypes={[["free"], ["pro"]]}
        dependentPluginIds={["queryBox:focusSelector"]}
      >
        <ChangeFocusModeActionItem />
      </CsUiPluginsGuard>
      <CsUiPluginsGuard
        allowedAccountTypes={[["pro"], ["pro", "enterprise"]]}
        dependentPluginIds={["queryBox:languageModelSelector"]}
      >
        <ChangeModelActionItem />
      </CsUiPluginsGuard>
      <CsUiPluginsGuard dependentPluginIds={["commandMenu"]}>
        <SearchSpacesActionItem />
      </CsUiPluginsGuard>
    </>
  );
}
