import { QueryBoxType } from "@/data/plugins/query-box/types";
import ChangeFocusModeActionItem from "@/features/plugins/query-box/slash-command-menu/components/action-items/ChangeFocusMode";
import ChangeModelActionItem from "@/features/plugins/query-box/slash-command-menu/components/action-items/ChangeModel";
import SearchSpacesActionItem from "@/features/plugins/query-box/slash-command-menu/components/action-items/SearchSpaces";

export default function ActionItems({
  queryBoxType,
}: {
  queryBoxType: QueryBoxType;
}) {
  return (
    <>
      <ChangeFocusModeActionItem queryBoxType={queryBoxType} />
      <ChangeModelActionItem queryBoxType={queryBoxType} />
      <SearchSpacesActionItem queryBoxType={queryBoxType} />
    </>
  );
}
