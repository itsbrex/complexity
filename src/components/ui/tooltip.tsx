import { Tooltip as ArkTooltip, Portal } from "@ark-ui/react";
import React, { ElementRef, FC, forwardRef } from "react";

type TooltipContext = {
  positioning: ArkTooltip.RootProps["positioning"];
};

const TooltipContext = createContext<TooltipContext>({
  positioning: {
    placement: "top",
  },
});

const TooltipContextProvider = TooltipContext.Provider;

const TooltipRoot: FC<ArkTooltip.RootProps> = ({ positioning, ...props }) => {
  return (
    <TooltipContextProvider value={{ positioning }}>
      <ArkTooltip.Root
        unmountOnExit={false}
        lazyMount={true}
        positioning={positioning}
        {...props}
      />
    </TooltipContextProvider>
  );
};

const TooltipTrigger = forwardRef<
  ElementRef<typeof ArkTooltip.Trigger>,
  ArkTooltip.TriggerProps
>(({ ...props }, ref) => {
  return (
    <ArkTooltip.Context>
      {({ setOpen }) => (
        <ArkTooltip.Trigger
          ref={ref}
          onTouchStart={() => setOpen(true)}
          {...props}
        />
      )}
    </ArkTooltip.Context>
  );
});

TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = forwardRef<
  ElementRef<typeof ArkTooltip.Content>,
  ArkTooltip.ContentProps & { portal?: boolean }
>(({ className, portal, ...props }, ref) => {
  const { positioning } = useContext(TooltipContext);

  if (!positioning) {
    throw new Error("TooltipContent must be used within a TooltipContext");
  }

  const Comp = portal ? Portal : React.Fragment;

  return (
    <Comp>
      <ArkTooltip.Positioner>
        <ArkTooltip.Content
          ref={ref}
          className={cn(
            "tw-z-50 tw-max-w-[400px] tw-overflow-hidden tw-whitespace-pre-line tw-rounded-md tw-bg-foreground tw-px-2 tw-py-1 tw-font-sans tw-text-xs tw-text-popover tw-shadow-md tw-duration-150 dark:tw-bg-primary-foreground dark:tw-text-popover-foreground",
            "data-[state=open]:tw-animate-in data-[state=closed]:tw-animate-out",
            "data-[state=closed]:tw-fade-out-0 data-[state=open]:tw-fade-in-0",
            "data-[state=closed]:tw-zoom-out-95 data-[state=open]:tw-zoom-in-95",
            "data-[side=bottom]:tw-slide-in-from-top-1 data-[side=left]:tw-slide-in-from-right-1",
            "data-[side=right]:tw-slide-in-from-left-1 data-[side=top]:tw-slide-in-from-bottom-1",
            className,
          )}
          data-side={positioning.placement}
          {...props}
        />
      </ArkTooltip.Positioner>
    </Comp>
  );
});

TooltipContent.displayName = "TooltipContent";

export { TooltipRoot, TooltipTrigger, TooltipContent };
