import { HoverCard as ArkHoverCard, Portal } from "@ark-ui/react";
import { Slot } from "@radix-ui/react-slot";
import { createContext, use } from "react";

const HoverCardRootProvider = ArkHoverCard.RootProvider;

type HoverCardLocalContext = {
  portal: boolean;
};

const HoverCardLocalContext = createContext<HoverCardLocalContext>({
  portal: true,
});

const HoverCardLocalContextProvider = HoverCardLocalContext.Provider;

function HoverCard({
  portal,
  ...props
}: ArkHoverCard.RootProps & {
  portal?: boolean;
}) {
  return (
    <HoverCardLocalContextProvider
      value={{
        portal: portal ?? true,
      }}
    >
      <ArkHoverCard.Root unmountOnExit={true} lazyMount={true} {...props} />
    </HoverCardLocalContextProvider>
  );
}

HoverCard.displayName = "HoverCard";

const HoverCardTrigger = ({ ...props }: ArkHoverCard.TriggerProps) => {
  return <ArkHoverCard.Trigger {...props} />;
};

HoverCardTrigger.displayName = "HoverCardTrigger";

const HoverCardContent = ({
  className,
  ...props
}: ArkHoverCard.ContentProps) => {
  const { portal } = use(HoverCardLocalContext);

  if (typeof portal === "undefined") {
    throw new Error("HoverCardContent must be a child of HoverCard");
  }

  const Comp = portal ? Portal : Slot;

  return (
    <Comp>
      <ArkHoverCard.Positioner>
        <ArkHoverCard.Content
          className={cn(
            "x-bg-hoverCard x-text-hoverCard-foreground x-z-50 x-w-max x-rounded-md x-border x-border-border/50 x-bg-popover x-p-4 x-shadow-md focus-visible:x-outline-none",
            "data-[state=open]:x-animate-in data-[state=closed]:x-animate-out",
            "data-[state=closed]:x-fade-out-0 data-[state=open]:x-fade-in-0",
            "data-[state=closed]:x-zoom-out-95 data-[state=open]:x-zoom-in-95",
            "data-[side=bottom]:x-slide-in-from-top-2 data-[side=left]:x-slide-in-from-right-2",
            "data-[side=right]:x-slide-in-from-left-2 data-[side=top]:x-slide-in-from-bottom-2",
            className,
          )}
          {...props}
        />
      </ArkHoverCard.Positioner>
    </Comp>
  );
};

HoverCardContent.displayName = "HoverCardContent";

const HoverCardContext = ArkHoverCard.Context;

export {
  HoverCard,
  HoverCardRootProvider,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardContext,
};
