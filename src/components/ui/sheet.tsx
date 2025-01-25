import { Dialog as ArkDialog } from "@ark-ui/react/dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { type HTMLAttributes } from "react";
import { LuX as X } from "react-icons/lu";

import { Portal } from "@/components/ui/portal";

const Sheet = ArkDialog.Root;
const SheetTrigger = ArkDialog.Trigger;
const SheetClose = ArkDialog.CloseTrigger;
const SheetPortal = Portal;

const SheetOverlay = ({ className, ...props }: ArkDialog.BackdropProps) => (
  <ArkDialog.Backdrop
    className={cn(
      "x-fixed x-inset-0 x-z-50 x-bg-black/80",
      "data-[state=open]:x-animate-in data-[state=closed]:x-animate-out",
      "data-[state=closed]:x-fade-out-0 data-[state=open]:x-fade-in-0",
      className,
    )}
    {...props}
  />
);
SheetOverlay.displayName = ArkDialog.Backdrop.displayName;

const sheetVariants = cva(
  "x-fixed x-z-50 x-bg-background x-shadow-lg x-transition x-ease-in-out",
  {
    variants: {
      side: {
        top: "x-inset-x-0 x-top-0 x-overflow-y-auto x-border-b",
        bottom: "x-inset-x-0 x-bottom-0 x-overflow-y-auto x-border-t",
        left: "x-inset-y-0 x-left-0 x-h-full x-w-3/4 x-border-r sm:x-max-w-sm",
        right:
          "x-inset-y-0 x-right-0 x-h-full x-w-3/4 x-border-l sm:x-max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

type SheetContentProps = ArkDialog.ContentProps &
  VariantProps<typeof sheetVariants> & {
    closeButton?: boolean;
  };

const SheetContent = ({
  side = "right",
  className,
  children,
  closeButton = true,
  ...props
}: SheetContentProps) => (
  <SheetPortal>
    <SheetOverlay />
    <ArkDialog.Positioner>
      <ArkDialog.Content
        className={cn(
          sheetVariants({ side }),
          "x-p-6",
          "x-border-border/50",
          {
            "x-h-[100dvh]": side === "left" || side === "right",
            "x-h-auto x-max-h-[75vh] !x-w-screen":
              side === "top" || side === "bottom",
            "data-[state=open]:x-animate-in data-[state=closed]:x-animate-out":
              true,
            "data-[state=closed]:x-slide-out-to-left data-[state=open]:x-slide-in-from-left":
              side === "left",
            "data-[state=closed]:x-slide-out-to-right data-[state=open]:x-slide-in-from-right":
              side === "right",
            "data-[state=closed]:x-slide-out-to-top data-[state=open]:x-slide-in-from-top":
              side === "top",
            "data-[state=closed]:x-slide-out-to-bottom data-[state=open]:x-slide-in-from-bottom":
              side === "bottom",
            "data-[state=closed]:x-duration-300 data-[state=open]:x-duration-300":
              true,
          },
          className,
        )}
        {...props}
      >
        {children}
        {closeButton && (
          <SheetClose className="x-absolute x-right-4 x-top-4 x-rounded-sm x-opacity-70 x-ring-ring hover:x-opacity-100 focus:x-outline-none focus:x-ring-2 focus:x-ring-offset-2 disabled:x-pointer-events-none">
            <X className="x-h-4 x-w-4" />
            <span className="x-sr-only">Close</span>
          </SheetClose>
        )}
      </ArkDialog.Content>
    </ArkDialog.Positioner>
  </SheetPortal>
);
SheetContent.displayName = ArkDialog.Content.displayName;

const SheetHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("x-flex x-flex-col x-space-y-1.5", className)}
    {...props}
  />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "x-flex x-flex-col-reverse sm:x-flex-row sm:x-justify-end sm:x-space-x-2",
      className,
    )}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = ({ className, ...props }: ArkDialog.TitleProps) => (
  <ArkDialog.Title
    className={cn(
      "x-text-lg x-font-semibold x-leading-none x-tracking-tight",
      className,
    )}
    {...props}
  />
);
SheetTitle.displayName = ArkDialog.Title.displayName;

const SheetDescription = ({
  className,
  ...props
}: ArkDialog.DescriptionProps) => (
  <ArkDialog.Description
    className={cn("x-text-sm x-text-muted-foreground", className)}
    {...props}
  />
);
SheetDescription.displayName = ArkDialog.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
