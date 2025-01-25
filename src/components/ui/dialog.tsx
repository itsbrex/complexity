import { Dialog as ArkDialog } from "@ark-ui/react";
import { type HTMLAttributes } from "react";
import React from "react";
import { LuX as X } from "react-icons/lu";

import { Portal } from "@/components/ui/portal";

export type DialogProps = ArkDialog.RootProps;

const Dialog = ArkDialog.Root;

const DialogTrigger = ArkDialog.Trigger;

const DialogPortal = Portal;

const DialogClose = ArkDialog.CloseTrigger;

const DialogOverlay = ({ className, ...props }: ArkDialog.BackdropProps) => {
  return (
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
};

DialogOverlay.displayName = ArkDialog.Backdrop.displayName;

const DialogContent = ({
  children,
  portal = true,
  className,
  closeButton = true,
  ...props
}: ArkDialog.ContentProps & { portal?: boolean; closeButton?: boolean }) => {
  const Comp = portal ? DialogPortal : React.Fragment;

  return (
    <Comp>
      <DialogOverlay />
      <ArkDialog.Positioner>
        <ArkDialog.Content
          className={cn(
            "custom-scrollbar x-fixed x-left-[50%] x-top-[50%] x-z-50 x-flex x-max-h-[95vh] x-w-full x-max-w-lg x-flex-col x-overflow-y-auto x-fill-mode-forwards",
            "x-translate-x-[-50%] x-translate-y-[-50%] x-gap-4 x-border x-border-border/50 x-bg-background x-p-6 x-shadow-lg x-duration-200",
            "x-max-h-[95vh] data-[state=closed]:x-hidden data-[state=closed]:x-animate-out data-[state=open]:x-fade-in-0",
            "sm:x-rounded-lg",
            className,
          )}
          {...props}
        >
          {children}
          {closeButton && (
            <DialogClose className="x-absolute x-right-4 x-top-4 x-rounded-sm x-opacity-70 x-ring-offset-background x-transition-opacity hover:x-opacity-100 focus:x-outline-none focus:x-ring-2 focus:x-ring-ring focus:x-ring-offset-2 disabled:x-pointer-events-none data-[state=open]:x-bg-primary-foreground data-[state=open]:x-text-muted-foreground">
              <X className="x-h-4 x-w-4" />
              <span className="x-sr-only">Close</span>
            </DialogClose>
          )}
        </ArkDialog.Content>
      </ArkDialog.Positioner>
    </Comp>
  );
};

DialogContent.displayName = ArkDialog.Content.displayName;

function DialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("x-flex x-flex-col x-space-y-1.5", className)}
      {...props}
    />
  );
}

DialogHeader.displayName = "DialogHeader";

function DialogFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "x-flex x-flex-col-reverse x-gap-2 sm:x-flex-row sm:x-justify-end",
        className,
      )}
      {...props}
    />
  );
}

DialogFooter.displayName = "DialogFooter";

const DialogTitle = ({ className, ...props }: ArkDialog.TitleProps) => {
  return (
    <ArkDialog.Title
      className={cn(
        "x-text-lg x-font-semibold x-leading-none x-tracking-tight",
        className,
      )}
      {...props}
    />
  );
};

DialogTitle.displayName = "DialogTitle";

const DialogDescription = ({
  className,
  ...props
}: ArkDialog.DescriptionProps) => {
  return (
    <ArkDialog.Description
      className={cn("x-text-sm x-text-muted-foreground", className)}
      {...props}
    />
  );
};

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
