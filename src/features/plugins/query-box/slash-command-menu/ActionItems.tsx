import {
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command";
import { ACTION_ITEMS } from "@/features/plugins/query-box/slash-command-menu/action-items";
import { slashCommandMenuStore } from "@/features/plugins/query-box/slash-command-menu/store";

export default function ActionItems() {
  return (
    <CommandGroup heading="Action">
      {ACTION_ITEMS.map((item) => (
        <CommandItem
          key={item.label}
          value={item.command}
          keywords={item.keywords ?? item.label.split(" ")}
          className="tw-min-h-10"
          onSelect={() => {
            slashCommandMenuStore.getState().setIsOpen(false);
            item.action();
          }}
        >
          <div className="tw-flex tw-items-center tw-gap-2">
            <div className="tw-flex tw-items-center tw-gap-2">
              {item.Icon && <item.Icon className="tw-size-4" />}
              <div>{item.label}</div>
            </div>
            {item.description && (
              <div className="tw-text-muted-foreground">
                ({item.description})
              </div>
            )}
          </div>
          <CommandShortcut>/{item.command}</CommandShortcut>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}
