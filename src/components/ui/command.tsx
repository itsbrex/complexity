import { Command as CommandPrimitive } from "cmdk";
import * as React from "react";
import { LuSearch as Search } from "react-icons/lu";

import { Dialog, DialogContent, DialogProps } from "@/components/ui/dialog";

const Command = ({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) => (
  <CommandPrimitive
    className={cn(
      "x-flex x-h-full x-w-full x-flex-col x-overflow-hidden x-rounded-md x-bg-popover x-text-popover-foreground",
      className,
    )}
    {...props}
  />
);
Command.displayName = CommandPrimitive.displayName;

type CommandDialogProps = DialogProps & {
  commandProps?: React.ComponentProps<typeof CommandPrimitive>;
};

const CommandDialog = ({
  children,
  commandProps,
  ...props
}: CommandDialogProps) => {
  return (
    <Dialog lazyMount unmountOnExit closeOnInteractOutside {...props}>
      <DialogContent className="x-overflow-hidden x-p-0 x-shadow-lg">
        <Command
          className="[&_[cmdk-group-heading]]:x-px-2 [&_[cmdk-group-heading]]:x-font-medium [&_[cmdk-group-heading]]:x-text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:x-pt-0 [&_[cmdk-group]]:x-px-2 [&_[cmdk-input-wrapper]_svg]:x-h-4 [&_[cmdk-input-wrapper]_svg]:x-w-4 [&_[cmdk-input]]:x-h-12 [&_[cmdk-item]]:x-px-2 [&_[cmdk-item]]:x-py-2 [&_[cmdk-item]_svg]:x-h-4 [&_[cmdk-item]_svg]:x-w-4"
          filter={(value, search, keywords) => {
            const extendValue = value + " " + (keywords?.join(" ") || "");
            if (extendValue.includes(search)) return 1;
            return 0;
          }}
          {...commandProps}
        >
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

CommandDialog.displayName = "CommandDialog";

const CommandInput = ({
  className,
  inputClassName,
  searchIcon = true,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input> & {
  inputClassName?: string;
  searchIcon?: boolean;
}) => (
  <div
    className={cn(
      "x-flex x-items-center x-border-b x-border-border/50 x-px-3",
      className,
    )}
    // eslint-disable-next-line react/no-unknown-property
    cmdk-input-wrapper=""
  >
    {searchIcon && (
      <Search className="x-mr-2 x-h-4 x-w-4 x-shrink-0 x-opacity-50" />
    )}
    <CommandPrimitive.Input
      className={cn(
        "x-flex x-h-11 x-w-full x-rounded-md x-bg-transparent x-py-3 x-text-sm x-outline-none placeholder:x-text-muted-foreground disabled:x-cursor-not-allowed disabled:x-opacity-50",
        inputClassName,
      )}
      {...props}
    />
  </div>
);

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = ({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) => (
  <CommandPrimitive.List
    className={cn(
      "custom-scrollbar x-max-h-[300px] x-overflow-y-auto x-overflow-x-hidden",
      className,
    )}
    {...props}
  />
);

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = ({
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) => (
  <CommandPrimitive.Empty
    className="x-py-6 x-text-center x-text-sm"
    {...props}
  />
);

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) => (
  <CommandPrimitive.Group
    className={cn(
      "x-overflow-hidden x-p-1 x-text-foreground [&_[cmdk-group-heading]]:x-px-2 [&_[cmdk-group-heading]]:x-py-1.5 [&_[cmdk-group-heading]]:x-text-xs [&_[cmdk-group-heading]]:x-font-medium [&_[cmdk-group-heading]]:x-text-muted-foreground",
      className,
    )}
    {...props}
  />
);

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = ({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) => (
  <CommandPrimitive.Separator
    className={cn("-x-mx-1 x-h-px x-bg-border", className)}
    {...props}
  />
);
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = ({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) => (
  <CommandPrimitive.Item
    className={cn(
      "x-relative x-flex x-cursor-pointer x-select-none x-items-center x-rounded-sm x-px-2 x-py-1.5 x-text-xs x-text-muted-foreground x-outline-none aria-selected:x-bg-primary-foreground aria-selected:x-text-primary data-[disabled=true]:x-pointer-events-none data-[disabled=true]:x-opacity-50",
      className,
    )}
    {...props}
  />
);

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "x-ml-auto x-text-xs x-tracking-widest x-text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
};
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};
