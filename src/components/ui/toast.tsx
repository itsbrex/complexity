import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { ComponentProps } from "react";
import { LuX as X } from "react-icons/lu";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = ({
  className,
  ...props
}: ToastPrimitives.ToastViewportProps) => (
  <ToastPrimitives.Viewport
    className={cn(
      "x-fixed x-left-1/2 x-top-[var(--navbar-height,0)] x-z-[100] x-flex x-max-h-screen x-w-screen -x-translate-x-1/2 x-flex-col-reverse x-items-center x-justify-end x-p-4 md:x-left-[unset] md:x-right-8 md:x-w-auto md:x-max-w-[420px] md:x-translate-x-[unset]",
      className,
    )}
    {...props}
  />
);
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "x-group x-pointer-events-auto x-relative x-flex !x-w-full x-items-center x-justify-between x-space-x-4 x-overflow-hidden x-rounded-md x-border x-p-6 x-pr-8 x-shadow-lg x-transition-all data-[swipe=cancel]:x-translate-x-0 data-[swipe=end]:x-translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:x-translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:x-transition-none data-[state=open]:x-animate-in data-[state=closed]:x-animate-out data-[swipe=end]:x-animate-out data-[state=closed]:x-fade-out-80 data-[state=closed]:x-slide-out-to-right-full data-[state=open]:x-slide-in-from-top-full data-[state=open]:sm:x-slide-in-from-top-full",
  {
    variants: {
      variant: {
        default:
          "x-border-border/50 x-bg-secondary x-text-secondary-foreground",
        destructive:
          "x-destructive x-group x-border-destructive x-bg-destructive x-text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Toast = ({
  className,
  variant = "default",
  ...props
}: ToastPrimitives.ToastProps & {
  variant?: VariantProps<typeof toastVariants>["variant"];
}) => {
  return (
    <ToastPrimitives.Root
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
};
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = ({
  className,
  ...props
}: ToastPrimitives.ToastActionProps) => (
  <ToastPrimitives.Action
    className={cn(
      "x-inline-flex x-h-8 x-shrink-0 x-items-center x-justify-center x-rounded-md x-border x-border-border/50 x-bg-transparent x-px-3 x-text-sm x-font-medium x-ring-offset-background x-transition-colors hover:x-bg-secondary focus:x-outline-none focus:x-ring-2 focus:x-ring-ring focus:x-ring-offset-2 disabled:x-pointer-events-none disabled:x-opacity-50 group-[.destructive]:x-border-muted/40 group-[.destructive]:hover:x-border-destructive/30 group-[.destructive]:hover:x-bg-destructive group-[.destructive]:hover:x-text-destructive-foreground group-[.destructive]:focus:x-ring-destructive",
      className,
    )}
    {...props}
  />
);
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = ({
  className,
  ...props
}: ToastPrimitives.ToastCloseProps) => (
  <ToastPrimitives.Close
    className={cn(
      "x-absolute x-right-2 x-top-2 x-rounded-md x-p-1 x-text-foreground/50 x-opacity-0 x-transition-opacity hover:x-text-foreground focus:x-opacity-100 focus:x-outline-none focus:x-ring-2 group-hover:x-opacity-100 group-[.destructive]:x-text-red-300 group-[.destructive]:hover:x-text-red-50 group-[.destructive]:focus:x-ring-red-400 group-[.destructive]:focus:x-ring-offset-red-600",
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="x-h-4 x-w-4" />
  </ToastPrimitives.Close>
);
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = ({
  className,
  ...props
}: ToastPrimitives.ToastTitleProps) => (
  <ToastPrimitives.Title
    className={cn("x-text-sm x-font-semibold", className)}
    {...props}
  />
);
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = ({
  className,
  ...props
}: ToastPrimitives.ToastDescriptionProps) => (
  <ToastPrimitives.Description
    className={cn("x-text-sm x-opacity-90", className)}
    {...props}
  />
);
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = ComponentProps<typeof Toast>;

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
