import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "x-inline-flex x-items-center x-justify-center x-whitespace-nowrap x-rounded-md x-font-sans x-text-sm x-font-medium x-ring-offset-background x-transition-all x-duration-300 x-ease-in-out focus-visible:x-outline-none focus-visible:x-ring-2 focus-visible:x-ring-ring focus-visible:x-ring-offset-2 active:x-scale-95 disabled:x-pointer-events-none disabled:x-opacity-50",
  {
    variants: {
      variant: {
        default:
          "x-bg-buttonBackground x-text-foreground hover:x-text-muted-foreground",
        destructive:
          "x-bg-destructive x-text-destructive-foreground hover:x-bg-destructive/90",
        outline:
          "x-border x-border-border/50 x-bg-transparent x-text-muted-foreground hover:x-text-foreground",
        primary:
          "x-bg-primary x-text-white hover:x-bg-primary/80 dark:x-text-[oklch(var(--dark-background-color-100))]",
        secondary:
          "x-bg-secondary x-text-secondary-foreground hover:x-bg-secondary/80",
        ghost:
          "x-text-muted-foreground hover:x-bg-primary-foreground hover:x-text-primary",
        link: "x-text-primary x-underline-offset-4 hover:x-underline",
      },
      size: {
        default: "x-h-10 x-px-4 x-py-2",
        sm: "x-h-9 x-rounded-md x-px-3",
        lg: "x-h-11 x-rounded-md x-px-8",
        icon: "x-h-10 x-w-10",
        iconSm: "x-h-8 x-w-8",
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

const Button = ({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
};

Button.displayName = "Button";

export { Button };
