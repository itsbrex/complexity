import { LuHistory } from "react-icons/lu";

import { CommandItem, CommandShortcut } from "@/components/ui/command";
import { slashCommandMenuStore } from "@/plugins/slash-command-menu/store";

export default function PromptHistoryFilterItem() {
  const label = t(
    "plugin-slash-command-menu:slashCommandMenu.filterItems.promptHistory.label",
  );
  const description = t(
    "plugin-slash-command-menu:slashCommandMenu.filterItems.promptHistory.description",
  );

  return (
    <CommandItem
      value="h"
      keywords={label.split(" ")}
      className="tw-min-h-10"
      onSelect={() => {
        slashCommandMenuStore.getState().actions.setFilter("promptHistory");
        slashCommandMenuStore.getState().actions.clearSearchValue();
      }}
    >
      <div className="tw-flex tw-items-center tw-gap-2">
        <div className="tw-flex tw-items-center tw-gap-2">
          <LuHistory className="tw-size-4" />
          <div>{label}</div>
        </div>
        {description && (
          <div className="tw-text-muted-foreground">({description})</div>
        )}
      </div>
      <CommandShortcut>/h</CommandShortcut>
    </CommandItem>
  );
}
