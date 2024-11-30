import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import * as SheetPrimitive from "@/components/ui/dialog";
import { Portal } from "@/components/ui/portal";

const Sheet = SheetPrimitive.Dialog;

const SheetTrigger = SheetPrimitive.DialogTrigger;

const SheetClose = SheetPrimitive.DialogClose;

const SheetPortal = Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.DialogOverlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.DialogOverlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.DialogOverlay
    className={cn(
      "tw-fixed tw-inset-0 tw-z-50 tw-bg-black/80 data-[state=open]:tw-animate-in data-[state=closed]:tw-animate-out data-[state=closed]:tw-fade-out-0 data-[state=open]:tw-fade-in-0",
      className,
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.DialogOverlay.displayName;

const sheetVariants = cva(
  "tw-fixed tw-z-50 tw-translate-x-0 tw-translate-y-0 tw-gap-4 tw-border-border/50 tw-bg-background tw-p-6 tw-shadow-lg tw-transition tw-ease-in-out data-[state=closed]:tw-duration-300 data-[state=open]:tw-duration-500 data-[state=open]:tw-animate-in data-[state=closed]:tw-animate-out sm:tw-rounded-none",
  {
    variants: {
      side: {
        top: "tw-inset-x-0 tw-top-0 tw-max-h-[75vh] tw-w-[100vw] tw-max-w-[100vw] tw-overflow-y-auto tw-border-b tw-border-l-0 tw-border-r-0 data-[state=closed]:tw-slide-out-to-top data-[state=open]:tw-slide-in-from-top",
        bottom:
          "tw-inset-x-0 !tw-top-auto tw-bottom-0 tw-max-h-[75vh] tw-w-[100vw] tw-max-w-[100vw] tw-overflow-y-auto tw-border-l-0 tw-border-r-0 tw-border-t data-[state=closed]:tw-slide-out-to-bottom data-[state=open]:tw-slide-in-from-bottom",
        left: "tw-inset-y-0 tw-left-0 tw-h-full tw-w-3/4 tw-border-b-0 tw-border-r tw-border-t-0 data-[state=closed]:tw-slide-out-to-left data-[state=open]:tw-slide-in-from-left sm:tw-max-w-sm",
        right:
          "tw-inset-y-0 tw-left-[unset] tw-right-0 tw-h-full tw-w-3/4 tw-border-b-0 tw-border-l tw-border-t-0 data-[state=closed]:tw-slide-out-to-right data-[state=open]:tw-slide-in-from-right sm:tw-max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

type SheetContentProps = React.ComponentPropsWithoutRef<
  typeof SheetPrimitive.DialogContent
> &
  VariantProps<typeof sheetVariants>;

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.DialogContent>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPrimitive.DialogContent
    ref={ref}
    className={cn(
      {
        "tw-min-h-full": side === "left" || side === "right",
      },
      sheetVariants({ side }),
      className,
    )}
    closeButton={false}
    {...props}
  >
    {children}
  </SheetPrimitive.DialogContent>
));
SheetContent.displayName = SheetPrimitive.DialogContent.displayName;

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "tw-flex tw-flex-col tw-space-y-2 tw-text-center sm:tw-text-left",
      className,
    )}
    {...props}
  />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "tw-flex tw-flex-col-reverse sm:tw-flex-row sm:tw-justify-end sm:tw-space-x-2",
      className,
    )}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.DialogTitle>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.DialogTitle>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.DialogTitle
    ref={ref}
    className={cn("tw-text-lg tw-font-semibold tw-text-foreground", className)}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.DialogTitle.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.DialogDescription>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.DialogDescription>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.DialogDescription
    ref={ref}
    className={cn("tw-text-sm tw-text-muted-foreground", className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.DialogDescription.displayName;

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
