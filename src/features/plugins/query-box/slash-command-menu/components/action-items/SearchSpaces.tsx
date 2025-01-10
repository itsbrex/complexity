import PplxSpace from "@/components/icons/PplxSpace";
import { CommandItem } from "@/components/ui/command";
import { QueryBoxType } from "@/data/plugins/query-box/types";
import { useScopedQueryBoxContext } from "@/features/plugins/query-box/context/context";
import { slashCommandMenuStore } from "@/features/plugins/query-box/slash-command-menu/store";
import { TEST_ID_SELECTORS } from "@/utils/dom-selectors";

export default function SearchSpacesActionItem() {
  const { store } = useScopedQueryBoxContext();

  if (!(["main", "space"] as QueryBoxType[]).includes(store.type)) return null;

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
        slashCommandMenuStore.getState().setIsOpen(false);
        setTimeout(() => {
          $(
            `[data-testid=${TEST_ID_SELECTORS.QUERY_BOX.SPACE_NAVIGATOR}]:last`,
          ).trigger("click");
        }, 0);
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
