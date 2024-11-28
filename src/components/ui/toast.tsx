import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import {
  type ElementRef,
  forwardRef,
  type ComponentPropsWithoutRef,
} from "react";
import { LuX as X } from "react-icons/lu";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = forwardRef<
  ElementRef<typeof ToastPrimitives.Viewport>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "tw-fixed tw-left-1/2 tw-top-[var(--navbar-height,0)] tw-z-[100] tw-flex tw-max-h-screen tw-w-screen -tw-translate-x-1/2 tw-flex-col-reverse tw-items-center tw-justify-end tw-p-4 md:tw-left-[unset] md:tw-right-8 md:tw-w-auto md:tw-max-w-[420px] md:tw-translate-x-[unset]",
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "tw-group tw-pointer-events-auto tw-relative tw-flex !tw-w-full tw-items-center tw-justify-between tw-space-x-4 tw-overflow-hidden tw-rounded-md tw-border tw-p-6 tw-pr-8 tw-shadow-lg tw-transition-all data-[swipe=cancel]:tw-translate-x-0 data-[swipe=end]:tw-translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:tw-translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:tw-transition-none data-[state=open]:tw-animate-in data-[state=closed]:tw-animate-out data-[swipe=end]:tw-animate-out data-[state=closed]:tw-fade-out-80 data-[state=closed]:tw-slide-out-to-right-full data-[state=open]:tw-slide-in-from-top-full data-[state=open]:sm:tw-slide-in-from-top-full",
  {
    variants: {
      variant: {
        default:
          "tw-border-border/50 tw-bg-secondary tw-text-secondary-foreground",
        destructive:
          "tw-destructive tw-group tw-border-destructive tw-bg-destructive tw-text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Toast = forwardRef<
  ElementRef<typeof ToastPrimitives.Root>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = forwardRef<
  ElementRef<typeof ToastPrimitives.Action>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "tw-inline-flex tw-h-8 tw-shrink-0 tw-items-center tw-justify-center tw-rounded-md tw-border tw-border-border/50 tw-bg-transparent tw-px-3 tw-text-sm tw-font-medium tw-ring-offset-background tw-transition-colors hover:tw-bg-secondary focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-ring focus:tw-ring-offset-2 disabled:tw-pointer-events-none disabled:tw-opacity-50 group-[.destructive]:tw-border-muted/40 group-[.destructive]:hover:tw-border-destructive/30 group-[.destructive]:hover:tw-bg-destructive group-[.destructive]:hover:tw-text-destructive-foreground group-[.destructive]:focus:tw-ring-destructive",
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = forwardRef<
  ElementRef<typeof ToastPrimitives.Close>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "tw-absolute tw-right-2 tw-top-2 tw-rounded-md tw-p-1 tw-text-foreground/50 tw-opacity-0 tw-transition-opacity hover:tw-text-foreground focus:tw-opacity-100 focus:tw-outline-none focus:tw-ring-2 group-hover:tw-opacity-100 group-[.destructive]:tw-text-red-300 group-[.destructive]:hover:tw-text-red-50 group-[.destructive]:focus:tw-ring-red-400 group-[.destructive]:focus:tw-ring-offset-red-600",
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="tw-h-4 tw-w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = forwardRef<
  ElementRef<typeof ToastPrimitives.Title>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("tw-text-sm tw-font-semibold", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = forwardRef<
  ElementRef<typeof ToastPrimitives.Description>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("tw-text-sm tw-opacity-90", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  Toast,
  ToastAction,
  type ToastActionElement,
  ToastClose,
  ToastDescription,
  type ToastProps,
  ToastProvider,
  ToastTitle,
  ToastViewport,
};
