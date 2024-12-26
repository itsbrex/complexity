import { LuGlobe } from "react-icons/lu";

import { CommandItem } from "@/components/ui/command";
import { QueryBoxType } from "@/data/plugins/query-box/types";
import { useScopedQueryBoxContext } from "@/features/plugins/query-box/context/context";
import { slashCommandMenuStore } from "@/features/plugins/query-box/slash-command-menu/store";
import { TEST_ID_SELECTORS } from "@/utils/dom-selectors";

export default function ChangeFocusModeActionItem() {
  const { store } = useScopedQueryBoxContext();

  if (!(["main", "main-modal"] as QueryBoxType[]).includes(store.type))
    return null;

  const label = t(
    "plugin-slash-command-menu:slashCommandMenu.actionItems.changeFocusMode.label",
  );

  return (
    <CommandItem
      value="f"
      keywords={label.split(" ")}
      className="tw-min-h-10"
      onSelect={() => {
        slashCommandMenuStore.getState().queryBoxAction.deleteTriggerWord();
        $(
          `[data-testid=${TEST_ID_SELECTORS.QUERY_BOX.FOCUS_SELECTOR}] button:last`,
        ).trigger("click");
        slashCommandMenuStore.getState().setIsOpen(false);
      }}
    >
      <div className="tw-flex tw-items-center tw-gap-2">
        <div className="tw-flex tw-items-center tw-gap-2">
          <LuGlobe className="tw-size-4" />
          <div>{label}</div>
        </div>
      </div>
    </CommandItem>
  );
}
