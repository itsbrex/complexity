import { Dialog as ArkDialog } from "@ark-ui/react/dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ElementRef, type HTMLAttributes } from "react";
import { LuX as X } from "react-icons/lu";

import { Portal } from "@/components/ui/portal";

const Sheet = ArkDialog.Root;
const SheetTrigger = ArkDialog.Trigger;
const SheetClose = ArkDialog.CloseTrigger;
const SheetPortal = Portal;

const SheetOverlay = forwardRef<
  ElementRef<typeof ArkDialog.Backdrop>,
  ArkDialog.BackdropProps
>(({ className, ...props }, ref) => (
  <ArkDialog.Backdrop
    ref={ref}
    className={cn(
      "tw-fixed tw-inset-0 tw-z-50 tw-bg-black/80",
      "data-[state=open]:tw-animate-in data-[state=closed]:tw-animate-out",
      "data-[state=closed]:tw-fade-out-0 data-[state=open]:tw-fade-in-0",
      className,
    )}
    {...props}
  />
));
SheetOverlay.displayName = ArkDialog.Backdrop.displayName;

const sheetVariants = cva(
  "tw-fixed tw-z-50 tw-bg-background tw-shadow-lg tw-transition tw-ease-in-out",
  {
    variants: {
      side: {
        top: "tw-inset-x-0 tw-top-0 tw-overflow-y-auto tw-border-b",
        bottom: "tw-inset-x-0 tw-bottom-0 tw-overflow-y-auto tw-border-t",
        left: "tw-inset-y-0 tw-left-0 tw-h-full tw-w-3/4 tw-border-r sm:tw-max-w-sm",
        right:
          "tw-inset-y-0 tw-right-0 tw-h-full tw-w-3/4 tw-border-l sm:tw-max-w-sm",
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

const SheetContent = forwardRef<
  ElementRef<typeof ArkDialog.Content>,
  SheetContentProps
>(
  (
    { side = "right", className, children, closeButton = true, ...props },
    ref,
  ) => (
    <SheetPortal>
      <SheetOverlay />
      <ArkDialog.Positioner>
        <ArkDialog.Content
          ref={ref}
          className={cn(
            sheetVariants({ side }),
            "tw-p-6",
            "tw-border-border/50",
            {
              "tw-h-[100dvh]": side === "left" || side === "right",
              "tw-h-auto tw-max-h-[75vh] !tw-w-screen":
                side === "top" || side === "bottom",
              "data-[state=open]:tw-animate-in data-[state=closed]:tw-animate-out":
                true,
              "data-[state=closed]:tw-slide-out-to-left data-[state=open]:tw-slide-in-from-left":
                side === "left",
              "data-[state=closed]:tw-slide-out-to-right data-[state=open]:tw-slide-in-from-right":
                side === "right",
              "data-[state=closed]:tw-slide-out-to-top data-[state=open]:tw-slide-in-from-top":
                side === "top",
              "data-[state=closed]:tw-slide-out-to-bottom data-[state=open]:tw-slide-in-from-bottom":
                side === "bottom",
              "data-[state=closed]:tw-duration-300 data-[state=open]:tw-duration-300":
                true,
            },
            className,
          )}
          {...props}
        >
          {children}
          {closeButton && (
            <SheetClose className="tw-absolute tw-right-4 tw-top-4 tw-rounded-sm tw-opacity-70 tw-ring-ring hover:tw-opacity-100 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 disabled:tw-pointer-events-none">
              <X className="tw-h-4 tw-w-4" />
              <span className="tw-sr-only">Close</span>
            </SheetClose>
          )}
        </ArkDialog.Content>
      </ArkDialog.Positioner>
    </SheetPortal>
  ),
);
SheetContent.displayName = ArkDialog.Content.displayName;

const SheetHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("tw-flex tw-flex-col tw-space-y-1.5", className)}
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
      "tw-flex tw-flex-col-reverse sm:tw-flex-row sm:tw-justify-end sm:tw-space-x-2",
      className,
    )}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = forwardRef<
  ElementRef<typeof ArkDialog.Title>,
  ArkDialog.TitleProps
>(({ className, ...props }, ref) => (
  <ArkDialog.Title
    ref={ref}
    className={cn(
      "tw-text-lg tw-font-semibold tw-leading-none tw-tracking-tight",
      className,
    )}
    {...props}
  />
));
SheetTitle.displayName = ArkDialog.Title.displayName;

const SheetDescription = forwardRef<
  ElementRef<typeof ArkDialog.Description>,
  ArkDialog.DescriptionProps
>(({ className, ...props }, ref) => (
  <ArkDialog.Description
    ref={ref}
    className={cn("tw-text-sm tw-text-muted-foreground", className)}
    {...props}
  />
));
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
