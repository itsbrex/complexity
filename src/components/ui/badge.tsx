import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "x-inline-flex x-cursor-default x-items-center x-rounded-md x-border x-px-2.5 x-py-0.5 x-text-xs x-font-semibold x-transition-colors focus:x-outline-none focus:x-ring-2 focus:x-ring-ring focus:x-ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "x-border-transparent x-bg-primary x-text-primary-foreground hover:x-bg-primary/80",
        secondary:
          "x-border-transparent x-bg-secondary x-text-secondary-foreground hover:x-bg-secondary/80",
        destructive:
          "x-border-transparent x-bg-destructive x-text-destructive-foreground hover:x-bg-destructive/80",
        outline: "x-text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>;

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
