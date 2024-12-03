import { Command as CommandPrimitive } from "cmdk";

import KeyCombo from "@/components/KeyCombo";
import { CommandItem, CommandShortcut } from "@/components/ui/command";
import { useCommandMenuStore } from "@/features/plugins/command-menu/store";
import type { BaseItem } from "@/features/plugins/command-menu/types";

export type BaseCommandMenuItem = BaseItem & {
  onSelect?: () => void;
};

type BaseMenuItemProps = React.ComponentPropsWithoutRef<
  typeof CommandPrimitive.Item
> &
  BaseCommandMenuItem & {
    closeOnSelect?: boolean;
  };

const BaseMenuItem = memo(function BaseMenuItem({
  icon: Icon,
  label,
  shortcut,
  keywords,
  onSelect,
  closeOnSelect = true,
  ...props
}: BaseMenuItemProps) {
  const { closeCommandMenu } = useCommandMenuStore();

  return (
    <CommandItem
      keywords={keywords}
      onSelect={() => {
        onSelect?.();
        if (closeOnSelect) closeCommandMenu();
      }}
      {...props}
    >
      <Icon className="tw-mr-2 tw-size-4" />
      {label}
      {shortcut && (
        <CommandShortcut>
          <KeyCombo keys={shortcut} />
        </CommandShortcut>
      )}
    </CommandItem>
  );
});

export default BaseMenuItem;
