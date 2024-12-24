import { Popover as ArkPopover, Portal } from "@ark-ui/react";
import { Slot } from "@radix-ui/react-slot";
import { RefObject } from "react";

import { untrapWheel } from "@/utils/utils";

const PopoverRootProvider = ArkPopover.RootProvider;

function Popover({ ...props }: ArkPopover.RootProps) {
  return <ArkPopover.Root unmountOnExit={true} lazyMount={true} {...props} />;
}

Popover.displayName = "Popover";

const PopoverTrigger = ({ ...props }: ArkPopover.TriggerProps) => {
  return <ArkPopover.Trigger {...props} />;
};

PopoverTrigger.displayName = "PopoverTrigger";

const PopoverContent = ({
  className,
  portal = true,
  ref,
  ...props
}: ArkPopover.ContentProps & {
  ref?: RefObject<HTMLDivElement | null>;
  portal?: boolean;
}) => {
  const Comp = portal ? Portal : Slot;

  return (
    <Comp>
      <ArkPopover.Positioner>
        <ArkPopover.Content
          ref={ref}
          className={cn(
            "tw-z-50 tw-w-max tw-rounded-md tw-border tw-border-border/50 tw-bg-popover tw-p-4 tw-text-popover-foreground tw-shadow-md focus-visible:tw-outline-none",
            "data-[state=open]:tw-animate-in data-[state=closed]:tw-animate-out",
            "data-[state=closed]:tw-fade-out-0 data-[state=open]:tw-fade-in-0",
            "data-[state=closed]:tw-zoom-out-95 data-[state=open]:tw-zoom-in-95",
            "data-[side=bottom]:tw-slide-in-from-top-2 data-[side=left]:tw-slide-in-from-right-2",
            "data-[side=right]:tw-slide-in-from-left-2 data-[side=top]:tw-slide-in-from-bottom-2",
            className,
          )}
          onWheel={untrapWheel}
          {...props}
        />
      </ArkPopover.Positioner>
    </Comp>
  );
};

PopoverContent.displayName = "PopoverContent";

const PopoverContext = ArkPopover.Context;

export {
  PopoverRootProvider,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverContext,
};
