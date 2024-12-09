import { ComponentProps } from "react";

const Card = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={cn(
      "tw-rounded-lg tw-border tw-border-border/50 tw-bg-card tw-text-card-foreground tw-shadow-sm",
      className,
    )}
    {...props}
  />
);
Card.displayName = "Card";

const CardHeader = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={cn("tw-flex tw-flex-col tw-space-y-1.5 tw-p-4", className)}
    {...props}
  />
);
CardHeader.displayName = "CardHeader";

const CardTitle = ({ className, ...props }: ComponentProps<"h3">) => (
  <h3
    className={cn(
      "tw-text-2xl tw-font-semibold tw-leading-none tw-tracking-tight",
      className,
    )}
    {...props}
  />
);
CardTitle.displayName = "CardTitle";

const CardDescription = ({ className, ...props }: ComponentProps<"p">) => (
  <p
    className={cn("tw-text-sm tw-text-muted-foreground", className)}
    {...props}
  />
);
CardDescription.displayName = "CardDescription";

const CardContent = ({ className, ...props }: ComponentProps<"div">) => (
  <div className={cn("tw-p-4 tw-pt-0", className)} {...props} />
);
CardContent.displayName = "CardContent";

const CardFooter = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={cn("tw-flex tw-items-center tw-p-4 tw-pt-0", className)}
    {...props}
  />
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
