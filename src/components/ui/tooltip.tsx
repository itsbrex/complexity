import { Tooltip as ArkTooltip, Portal } from "@ark-ui/react";
import React, { use } from "react";

type TooltipContext = {
  positioning: ArkTooltip.RootProps["positioning"];
};

const TooltipContext = createContext<TooltipContext>({
  positioning: {
    placement: "top",
  },
});

const TooltipContextProvider = TooltipContext.Provider;

const TooltipRoot = ({ positioning, ...props }: ArkTooltip.RootProps) => {
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

const TooltipTrigger = ({ ...props }: ArkTooltip.TriggerProps) => {
  return (
    <ArkTooltip.Context>
      {({ setOpen }) => (
        <ArkTooltip.Trigger onTouchStart={() => setOpen(true)} {...props} />
      )}
    </ArkTooltip.Context>
  );
};

TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = ({
  className,
  portal,
  ...props
}: ArkTooltip.ContentProps & {
  portal: boolean;
}) => {
  const { positioning } = use(TooltipContext);

  if (!positioning) {
    throw new Error("TooltipContent must be used within a TooltipContext");
  }

  const Comp = portal ? Portal : React.Fragment;

  return (
    <Comp>
      <ArkTooltip.Positioner>
        <ArkTooltip.Content
          className={cn(
            "x-z-50 x-max-w-[400px] x-overflow-hidden x-whitespace-pre-line x-rounded-md x-bg-foreground x-px-2 x-py-1 x-font-sans x-text-xs x-text-popover x-shadow-md x-duration-150 dark:x-bg-primary-foreground dark:x-text-popover-foreground",
            "data-[state=open]:x-animate-in data-[state=closed]:x-animate-out",
            "data-[state=closed]:x-fade-out-0 data-[state=open]:x-fade-in-0",
            "data-[state=closed]:x-zoom-out-95 data-[state=open]:x-zoom-in-95",
            "data-[side=bottom]:x-slide-in-from-top-1 data-[side=left]:x-slide-in-from-right-1",
            "data-[side=right]:x-slide-in-from-left-1 data-[side=top]:x-slide-in-from-bottom-1",
            className,
          )}
          data-side={positioning.placement}
          {...props}
        />
      </ArkTooltip.Positioner>
    </Comp>
  );
};

TooltipContent.displayName = "TooltipContent";

export { TooltipRoot, TooltipTrigger, TooltipContent };
