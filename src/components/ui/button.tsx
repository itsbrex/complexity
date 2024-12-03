import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "tw-inline-flex tw-items-center tw-justify-center tw-whitespace-nowrap tw-rounded-md tw-font-sans tw-text-sm tw-font-medium tw-ring-offset-background tw-transition-all tw-duration-300 tw-ease-in-out focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 active:tw-scale-95 disabled:tw-pointer-events-none disabled:tw-opacity-50",
  {
    variants: {
      variant: {
        default:
          "tw-bg-button-background tw-text-foreground hover:tw-text-muted-foreground",
        destructive:
          "tw-bg-destructive tw-text-destructive-foreground hover:tw-bg-destructive/90",
        outline:
          "tw-border tw-border-border/50 tw-bg-transparent tw-text-muted-foreground hover:tw-text-foreground",
        secondary:
          "tw-bg-secondary tw-text-secondary-foreground hover:tw-bg-secondary/80",
        ghost:
          "tw-text-muted-foreground hover:tw-bg-primary-foreground hover:tw-text-primary",
        link: "tw-text-primary tw-underline-offset-4 hover:tw-underline",
      },
      size: {
        default: "tw-h-10 tw-px-4 tw-py-2",
        sm: "tw-h-9 tw-rounded-md tw-px-3",
        lg: "tw-h-11 tw-rounded-md tw-px-8",
        icon: "tw-h-10 tw-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };
