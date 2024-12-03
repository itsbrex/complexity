import { Menu, Portal } from "@ark-ui/react";
import {
  forwardRef,
  Fragment,
  type ElementRef,
  type HTMLAttributes,
} from "react";
import { LuChevronRight as ChevronRight } from "react-icons/lu";

const DropdownMenuRootProvider = Menu.RootProvider;

function DropdownMenu({ ...props }: Menu.RootProps) {
  return <Menu.Root unmountOnExit={false} lazyMount={true} {...props} />;
}

const DropdownMenuContext = Menu.Context;

const DropdownMenuTrigger = forwardRef<
  ElementRef<typeof Menu.Trigger>,
  Menu.TriggerProps
>(({ className, ...props }, ref) => (
  <Menu.Trigger ref={ref} className={cn(className)} {...props} />
));

DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = forwardRef<
  ElementRef<typeof Menu.Content>,
  Menu.ContentProps & { portal?: boolean }
>(({ portal = true, className, ...props }, ref) => {
  const Comp = portal ? Portal : Fragment;

  return (
    <Comp>
      <Menu.Positioner>
        <Menu.Content
          ref={ref}
          className={cn(
            "tw-z-50 tw-min-w-[8rem] tw-overflow-hidden tw-rounded-md tw-border tw-border-border/50 tw-bg-popover tw-p-1 tw-text-popover-foreground tw-shadow-md focus-visible:tw-outline-none",
            "data-[state=open]:tw-animate-in data-[state=open]:tw-fade-in data-[state=open]:tw-zoom-in-95",
            "data-[state=closed]:tw-animate-out data-[state=closed]:tw-fade-out data-[state=closed]:tw-zoom-out-95",
            "data-[placement^=top]:tw-slide-in-from-bottom-2",
            "data-[placement^=bottom]:tw-slide-in-from-top-2",
            "data-[placement^=left]:tw-slide-in-from-right-2",
            "data-[placement^=right]:tw-slide-in-from-left-2",
            className,
          )}
          {...props}
        />
      </Menu.Positioner>
    </Comp>
  );
});

DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = forwardRef<
  ElementRef<typeof Menu.Item>,
  Menu.ItemProps & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <Menu.Item
    ref={ref}
    className={cn(
      "tw-relative tw-flex tw-cursor-default tw-select-none tw-items-center tw-rounded-sm tw-px-2 tw-py-1.5 tw-text-sm tw-outline-none tw-transition-colors focus:tw-bg-primary-foreground focus:tw-text-primary data-[disabled]:tw-pointer-events-none data-[highlighted]:tw-bg-primary-foreground data-[highlighted]:tw-text-primary data-[disabled]:tw-opacity-50",
      inset && "tw-pl-8",
      className,
    )}
    {...props}
  />
));

DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuGroup = Menu.ItemGroup;

const DropdownMenuLabel = forwardRef<
  ElementRef<typeof Menu.ItemGroupLabel>,
  Menu.ItemGroupLabelProps & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <Menu.ItemGroupLabel
    ref={ref}
    className={cn(
      "tw-px-2 tw-py-1.5 tw-text-sm tw-text-muted-foreground",
      inset && "tw-pl-8",
      className,
    )}
    {...props}
  />
));

DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuSeparator = forwardRef<
  ElementRef<typeof Menu.Separator>,
  Menu.SeparatorProps
>(({ className, ...props }, ref) => (
  <Menu.Separator
    ref={ref}
    className={cn("tw--mx-1 tw-my-1 tw-h-px tw-bg-muted", className)}
    {...props}
  />
));

DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuSub = ({ ...props }: Menu.RootProps) => (
  <Menu.Root
    unmountOnExit={false}
    lazyMount={true}
    positioning={{
      placement: "right-start",
    }}
    {...props}
  />
);

const DropdownMenuSubTrigger = forwardRef<
  ElementRef<typeof Menu.TriggerItem>,
  Menu.TriggerItemProps & {
    inset?: boolean;
  }
>(({ className, children, ...props }, ref) => (
  <Menu.TriggerItem
    ref={ref}
    className={cn(
      "tw-relative tw-flex tw-cursor-default tw-select-none tw-items-center tw-justify-between tw-rounded-sm tw-text-sm tw-outline-none tw-transition-colors focus:tw-bg-primary-foreground focus:tw-text-primary data-[disabled]:tw-pointer-events-none data-[highlighted]:tw-bg-primary-foreground data-[highlighted]:tw-text-primary data-[disabled]:tw-opacity-50",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="tw-mr-2 tw-size-4" />
  </Menu.TriggerItem>
));
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

const DropdownMenuShortcut = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "tw-ml-auto tw-inline tw-text-xs tw-tracking-widest tw-opacity-60",
        className,
      )}
      {...props}
    />
  );
});

DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenuRootProvider,
  DropdownMenu,
  DropdownMenuContext,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
};
