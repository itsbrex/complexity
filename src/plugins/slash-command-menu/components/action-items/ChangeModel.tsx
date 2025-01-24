import { LuCpu } from "react-icons/lu";

import { CommandItem } from "@/components/ui/command";
import { slashCommandMenuStore } from "@/plugins/slash-command-menu/store";
import { TEST_ID_SELECTORS } from "@/utils/dom-selectors";

export default function ChangeModelActionItem() {
  const label = t(
    "plugin-slash-command-menu:slashCommandMenu.actionItems.changeModel.label",
  );

  return (
    <CommandItem
      value="m"
      keywords={label.split(" ")}
      className="tw-min-h-10"
      onSelect={() => {
        slashCommandMenuStore.getState().actions.deleteTriggerWord();
        slashCommandMenuStore.getState().actions.setIsOpen(false);
        setTimeout(() => {
          $(
            `[data-testid=${TEST_ID_SELECTORS.QUERY_BOX.LANGUAGE_MODEL_SELECTOR}] button:last`,
          ).trigger("click");
        }, 0);
      }}
    >
      <div className="tw-flex tw-items-center tw-gap-2">
        <div className="tw-flex tw-items-center tw-gap-2">
          <LuCpu className="tw-size-4" />
          <div>{label}</div>
        </div>
      </div>
    </CommandItem>
  );
}
