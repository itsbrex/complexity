import { Dialog as ArkDialog } from "@ark-ui/react";
import { forwardRef, type ElementRef, type HTMLAttributes } from "react";
import React from "react";
import { LuX as X } from "react-icons/lu";

import { Portal } from "@/components/ui/portal";

export type DialogProps = ArkDialog.RootProps;

const Dialog = ArkDialog.Root;

const DialogTrigger = ArkDialog.Trigger;

const DialogPortal = Portal;

const DialogClose = ArkDialog.CloseTrigger;

const DialogOverlay = forwardRef<
  ElementRef<typeof ArkDialog.Backdrop>,
  ArkDialog.BackdropProps
>(({ className, ...props }, ref) => {
  return (
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
  );
});

DialogOverlay.displayName = ArkDialog.Backdrop.displayName;

const DialogContent = forwardRef<
  ElementRef<typeof ArkDialog.Content>,
  ArkDialog.ContentProps & { closeButton?: boolean; portal?: boolean }
>(
  (
    { children, portal = true, className, closeButton = true, ...props },
    ref,
  ) => {
    const Comp = portal ? DialogPortal : React.Fragment;

    return (
      <Comp>
        <DialogOverlay />
        <ArkDialog.Positioner>
          <ArkDialog.Content
            ref={ref}
            className={cn(
              "tw-fixed tw-left-[50%] tw-top-[50%] tw-z-50 tw-flex tw-w-full tw-max-w-lg tw-flex-col tw-fill-mode-forwards",
              "tw-translate-x-[-50%] tw-translate-y-[-50%] tw-gap-4 tw-border tw-border-border/50 tw-bg-background tw-p-6 tw-shadow-lg tw-duration-200",
              "tw-max-h-[95vh] data-[state=closed]:tw-hidden data-[state=closed]:tw-animate-out data-[state=open]:tw-fade-in-0",
              "sm:tw-rounded-lg",
              className,
            )}
            {...props}
          >
            {children}
            {closeButton && (
              <DialogClose className="tw-absolute tw-right-4 tw-top-4 tw-rounded-sm tw-opacity-70 tw-ring-offset-background tw-transition-opacity hover:tw-opacity-100 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-ring focus:tw-ring-offset-2 disabled:tw-pointer-events-none data-[state=open]:tw-bg-primary-foreground data-[state=open]:tw-text-muted-foreground">
                <X className="tw-h-4 tw-w-4" />
                <span className="tw-sr-only">Close</span>
              </DialogClose>
            )}
          </ArkDialog.Content>
        </ArkDialog.Positioner>
      </Comp>
    );
  },
);

DialogContent.displayName = ArkDialog.Content.displayName;

function DialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "tw-flex tw-flex-col tw-space-y-1.5 tw-text-center sm:tw-text-left",
        className,
      )}
      {...props}
    />
  );
}

DialogHeader.displayName = "DialogHeader";

function DialogFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "tw-flex tw-flex-row-reverse sm:tw-flex-row sm:tw-justify-end sm:tw-space-x-2",
        className,
      )}
      {...props}
    />
  );
}

DialogFooter.displayName = "DialogFooter";

const DialogTitle = forwardRef<
  ElementRef<typeof ArkDialog.Title>,
  ArkDialog.TitleProps
>(({ className, ...props }, ref) => {
  return (
    <ArkDialog.Title
      ref={ref}
      className={cn(
        "tw-text-lg tw-font-semibold tw-leading-none tw-tracking-tight",
        className,
      )}
      {...props}
    />
  );
});

DialogTitle.displayName = "DialogTitle";

const DialogDescription = forwardRef<
  ElementRef<typeof ArkDialog.Description>,
  ArkDialog.DescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <ArkDialog.Description
      ref={ref}
      className={cn("tw-text-sm tw-text-muted-foreground", className)}
      {...props}
    />
  );
});

DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
