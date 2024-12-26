import ChangeFocusModeActionItem from "@/features/plugins/query-box/slash-command-menu/components/action-items/ChangeFocusMode";
import ChangeModelActionItem from "@/features/plugins/query-box/slash-command-menu/components/action-items/ChangeModel";
import SearchSpacesActionItem from "@/features/plugins/query-box/slash-command-menu/components/action-items/SearchSpaces";

export default function ActionItems() {
  return (
    <>
      <ChangeFocusModeActionItem />
      <ChangeModelActionItem />
      <SearchSpacesActionItem />
    </>
  );
}
