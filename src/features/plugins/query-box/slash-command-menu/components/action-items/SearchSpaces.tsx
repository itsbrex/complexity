import PplxSpace from "@/components/icons/PplxSpace";
import { CommandItem } from "@/components/ui/command";
import { commandMenuStore } from "@/data/plugins/command-menu/store";
import { slashCommandMenuStore } from "@/features/plugins/query-box/slash-command-menu/store";

export default function SearchSpacesActionItem() {
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
        commandMenuStore.getState().setOpen(true);
        commandMenuStore.getState().setFilter("spaces");
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
