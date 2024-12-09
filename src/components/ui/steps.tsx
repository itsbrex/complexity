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
      "tw-flex tw-w-full tw-items-center tw-gap-2",
      "data-[orientation=vertical]:tw-flex-col",
      className,
    )}
    {...props}
  />
);

StepsList.displayName = "StepsList";

const StepsItem = ({ className, ...props }: ArkSteps.ItemProps) => (
  <ArkSteps.Item
    className={cn(
      "tw-flex tw-flex-1 tw-items-center tw-gap-2",
      "data-[orientation=vertical]:tw-w-full",
      className,
    )}
    {...props}
  />
);

StepsItem.displayName = "StepsItem";

const StepsTrigger = ({ className, ...props }: ArkSteps.TriggerProps) => (
  <ArkSteps.Trigger
    className={cn(
      "tw-group tw-flex tw-w-full tw-items-center tw-gap-2 tw-text-sm tw-font-medium",
      "tw-transition-colors hover:tw-text-foreground/80",
      "disabled:tw-cursor-not-allowed disabled:tw-opacity-50",
      "focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2",
      className,
    )}
    {...props}
  />
);

StepsTrigger.displayName = "StepsTrigger";

const StepsIndicator = ({ className, ...props }: ArkSteps.IndicatorProps) => (
  <ArkSteps.Indicator
    className={cn(
      "tw-flex tw-h-8 tw-w-8 tw-items-center tw-justify-center tw-rounded-full tw-border-2 tw-bg-background tw-text-sm tw-font-medium",
      "tw-self-start tw-transition-colors",
      "group-data-[state=complete]:tw-border-primary group-data-[state=complete]:tw-text-primary",
      "group-data-[state=current]:tw-border-primary group-data-[state=current]:tw-text-primary",
      "group-data-[state=upcoming]:tw-border-muted-foreground group-data-[state=upcoming]:tw-text-muted-foreground",
      className,
    )}
    {...props}
  />
);

StepsIndicator.displayName = "StepsIndicator";

const StepsSeparator = ({ className, ...props }: ArkSteps.SeparatorProps) => (
  <ArkSteps.Separator
    className={cn(
      "tw-h-[2px] tw-flex-1 tw-bg-border",
      "data-[orientation=vertical]:tw-h-8 data-[orientation=vertical]:tw-w-[2px]",
      "group-data-[state=complete]:tw-bg-primary",
      className,
    )}
    {...props}
  />
);

StepsSeparator.displayName = "StepsSeparator";

const StepsContent = ({ className, ...props }: ArkSteps.ContentProps) => (
  <ArkSteps.Content
    className={cn("tw-mt-4 tw-text-sm", className)}
    {...props}
  />
);

StepsContent.displayName = "StepsContent";

const StepsCompletedContent = ({
  className,
  ...props
}: ArkSteps.CompletedContentProps) => (
  <ArkSteps.CompletedContent
    className={cn("tw-mt-4 tw-text-sm", className)}
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
