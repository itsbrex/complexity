import { Steps as ArkSteps } from "@ark-ui/react";
import { ComponentProps } from "react";

import { Button } from "@/components/ui/button";

const Steps = ArkSteps.Root;

const StepsContext = ArkSteps.Context;

const StepsList = ({
  className,
  ...props
}: ComponentProps<typeof ArkSteps.List>) => (
  <ArkSteps.List
    className={cn(
      "x-flex x-w-full x-items-center x-gap-2",
      "data-[orientation=vertical]:x-flex-col",
      className,
    )}
    {...props}
  />
);

StepsList.displayName = "StepsList";

const StepsItem = ({ className, ...props }: ArkSteps.ItemProps) => (
  <ArkSteps.Item
    className={cn(
      "x-flex x-flex-1 x-items-center x-gap-2",
      "data-[orientation=vertical]:x-w-full",
      className,
    )}
    {...props}
  />
);

StepsItem.displayName = "StepsItem";

const StepsTrigger = ({ className, ...props }: ArkSteps.TriggerProps) => (
  <ArkSteps.Trigger
    className={cn(
      "x-group x-flex x-w-full x-items-center x-gap-2 x-text-sm x-font-medium",
      "x-transition-colors hover:x-text-foreground/80",
      "disabled:x-cursor-not-allowed disabled:x-opacity-50",
      "focus-visible:x-outline-none focus-visible:x-ring-2 focus-visible:x-ring-ring focus-visible:x-ring-offset-2",
      className,
    )}
    {...props}
  />
);

StepsTrigger.displayName = "StepsTrigger";

const StepsIndicator = ({ className, ...props }: ArkSteps.IndicatorProps) => (
  <ArkSteps.Indicator
    className={cn(
      "x-flex x-h-8 x-w-8 x-items-center x-justify-center x-rounded-full x-border-2 x-bg-background x-text-sm x-font-medium",
      "x-self-start x-transition-colors",
      "group-data-[state=complete]:x-border-primary group-data-[state=complete]:x-text-primary",
      "group-data-[state=current]:x-border-primary group-data-[state=current]:x-text-primary",
      "group-data-[state=upcoming]:x-border-muted-foreground group-data-[state=upcoming]:x-text-muted-foreground",
      className,
    )}
    {...props}
  />
);

StepsIndicator.displayName = "StepsIndicator";

const StepsSeparator = ({ className, ...props }: ArkSteps.SeparatorProps) => (
  <ArkSteps.Separator
    className={cn(
      "x-h-[2px] x-flex-1 x-bg-border",
      "data-[orientation=vertical]:x-h-8 data-[orientation=vertical]:x-w-[2px]",
      "group-data-[state=complete]:x-bg-primary",
      className,
    )}
    {...props}
  />
);

StepsSeparator.displayName = "StepsSeparator";

const StepsContent = ({ className, ...props }: ArkSteps.ContentProps) => (
  <ArkSteps.Content className={cn("x-mt-4 x-text-sm", className)} {...props} />
);

StepsContent.displayName = "StepsContent";

const StepsCompletedContent = ({
  className,
  ...props
}: ArkSteps.CompletedContentProps) => (
  <ArkSteps.CompletedContent
    className={cn("x-mt-4 x-text-sm", className)}
    {...props}
  />
);

StepsCompletedContent.displayName = "StepsCompletedContent";

const StepsPrevTrigger = ({
  children,
  ...props
}: ArkSteps.PrevTriggerProps) => (
  <ArkSteps.PrevTrigger {...props} asChild>
    <Button variant="ghost" size="lg">
      {children}
    </Button>
  </ArkSteps.PrevTrigger>
);

StepsPrevTrigger.displayName = "StepsPrevTrigger";

const StepsNextTrigger = ({
  children,
  ...props
}: ArkSteps.NextTriggerProps) => (
  <ArkSteps.NextTrigger {...props} asChild>
    <Button variant="default" size="lg">
      {children}
    </Button>
  </ArkSteps.NextTrigger>
);

StepsNextTrigger.displayName = "StepsNextTrigger";

export {
  Steps,
  StepsContext,
  StepsList,
  StepsItem,
  StepsTrigger,
  StepsIndicator,
  StepsSeparator,
  StepsContent,
  StepsCompletedContent,
  StepsPrevTrigger,
  StepsNextTrigger,
};
