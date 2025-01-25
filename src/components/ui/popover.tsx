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
            "x-z-50 x-w-max x-rounded-md x-border x-border-border/50 x-bg-popover x-p-4 x-text-popover-foreground x-shadow-md focus-visible:x-outline-none",
            "data-[state=open]:x-animate-in data-[state=closed]:x-animate-out",
            "data-[state=closed]:x-fade-out-0 data-[state=open]:x-fade-in-0",
            "data-[state=closed]:x-zoom-out-95 data-[state=open]:x-zoom-in-95",
            "data-[side=bottom]:x-slide-in-from-top-2 data-[side=left]:x-slide-in-from-right-2",
            "data-[side=right]:x-slide-in-from-left-2 data-[side=top]:x-slide-in-from-bottom-2",
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
