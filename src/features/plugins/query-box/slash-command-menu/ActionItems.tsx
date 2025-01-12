import CsUiPluginsGuard from "@/components/CsUiPluginsGuard";
import ChangeFocusModeActionItem from "@/features/plugins/query-box/slash-command-menu/components/action-items/ChangeFocusMode";
import ChangeModelActionItem from "@/features/plugins/query-box/slash-command-menu/components/action-items/ChangeModel";
import SearchSpacesActionItem from "@/features/plugins/query-box/slash-command-menu/components/action-items/SearchSpaces";

export default function ActionItems() {
  return (
    <>
      <CsUiPluginsGuard
        allowedAccountTypes={["free", "pro"]}
        dependentPluginIds={["queryBox:focusSelector"]}
      >
        <ChangeFocusModeActionItem />
      </CsUiPluginsGuard>
      <CsUiPluginsGuard
        allowedAccountTypes={["pro", "enterprise"]}
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
