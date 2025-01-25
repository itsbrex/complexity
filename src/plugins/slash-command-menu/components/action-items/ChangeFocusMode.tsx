import { LuGlobe } from "react-icons/lu";

import { CommandItem } from "@/components/ui/command";
import { QueryBoxType } from "@/data/plugins/query-box/types";
import { useScopedQueryBoxContext } from "@/plugins/_core/ui-groups/query-box/context/context";
import { slashCommandMenuStore } from "@/plugins/slash-command-menu/store";
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
      className="x-min-h-10"
      onSelect={() => {
        slashCommandMenuStore.getState().actions.deleteTriggerWord();
        slashCommandMenuStore.getState().actions.setIsOpen(false);
        setTimeout(() => {
          $(
            `[data-testid=${TEST_ID_SELECTORS.QUERY_BOX.FOCUS_SELECTOR}] button:last`,
          ).trigger("click");
        }, 0);
      }}
    >
      <div className="x-flex x-items-center x-gap-2">
        <div className="x-flex x-items-center x-gap-2">
          <LuGlobe className="x-size-4" />
          <div>{label}</div>
        </div>
      </div>
    </CommandItem>
  );
}
