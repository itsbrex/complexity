import PplxSpace from "@/components/icons/PplxSpace";
import { CommandItem } from "@/components/ui/command";
import { QueryBoxType } from "@/data/plugins/query-box/types";
import { slashCommandMenuStore } from "@/features/plugins/query-box/slash-command-menu/store";
import { TEST_ID_SELECTORS } from "@/utils/dom-selectors";

export default function SearchSpacesActionItem({
  queryBoxType,
}: {
  queryBoxType: QueryBoxType;
}) {
  if (!(["main", "space"] as QueryBoxType[]).includes(queryBoxType))
    return null;

  const label = t(
    "plugin-slash-command-menu:slashCommandMenu.actionItems.searchSpaces.label",
  );

  return (
    <CommandItem
      value="s"
      keywords={label.split(" ")}
      className="tw-min-h-10"
      onSelect={() => {
        slashCommandMenuStore.getState().queryBoxAction.deleteTriggerWord();
        $(
          `[data-testid=${TEST_ID_SELECTORS.QUERY_BOX.SPACE_NAVIGATOR}]:last`,
        ).trigger("click");
        slashCommandMenuStore.getState().setIsOpen(false);
      }}
    >
      <div className="tw-flex tw-items-center tw-gap-2">
        <div className="tw-flex tw-items-center tw-gap-2">
          <PplxSpace className="tw-size-4" />
          <div>{label}</div>
        </div>
      </div>
    </CommandItem>
  );
}
