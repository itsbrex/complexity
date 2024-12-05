import { Steps as ArkSteps } from "@ark-ui/react";
import {
  forwardRef,
  type ElementRef,
  type ComponentPropsWithoutRef,
} from "react";

import { Button } from "@/components/ui/button";

const Steps = ArkSteps.Root;

const StepsContext = ArkSteps.Context;

const StepsList = forwardRef<
  ElementRef<typeof ArkSteps.List>,
  ComponentPropsWithoutRef<typeof ArkSteps.List>
>(({ className, ...props }, ref) => (
  <ArkSteps.List
    ref={ref}
    className={cn(
      "tw-flex tw-w-full tw-items-center tw-gap-2",
      "data-[orientation=vertical]:tw-flex-col",
      className,
    )}
    {...props}
  />
));

StepsList.displayName = "StepsList";

const StepsItem = forwardRef<
  ElementRef<typeof ArkSteps.Item>,
  ComponentPropsWithoutRef<typeof ArkSteps.Item>
>(({ className, ...props }, ref) => (
  <ArkSteps.Item
    ref={ref}
    className={cn(
      "tw-flex tw-flex-1 tw-items-center tw-gap-2",
      "data-[orientation=vertical]:tw-w-full",
      className,
    )}
    {...props}
  />
));

StepsItem.displayName = "StepsItem";

const StepsTrigger = forwardRef<
  ElementRef<typeof ArkSteps.Trigger>,
  ComponentPropsWithoutRef<typeof ArkSteps.Trigger>
>(({ className, ...props }, ref) => (
  <ArkSteps.Trigger
    ref={ref}
    className={cn(
      "tw-group tw-flex tw-w-full tw-items-center tw-gap-2 tw-text-sm tw-font-medium",
      "tw-transition-colors hover:tw-text-foreground/80",
      "disabled:tw-cursor-not-allowed disabled:tw-opacity-50",
      "focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2",
      className,
    )}
    {...props}
  />
));

StepsTrigger.displayName = "StepsTrigger";

const StepsIndicator = forwardRef<
  ElementRef<typeof ArkSteps.Indicator>,
  ComponentPropsWithoutRef<typeof ArkSteps.Indicator>
>(({ className, ...props }, ref) => (
  <ArkSteps.Indicator
    ref={ref}
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
));

StepsIndicator.displayName = "StepsIndicator";

const StepsSeparator = forwardRef<
  ElementRef<typeof ArkSteps.Separator>,
  ComponentPropsWithoutRef<typeof ArkSteps.Separator>
>(({ className, ...props }, ref) => (
  <ArkSteps.Separator
    ref={ref}
    className={cn(
      "tw-h-[2px] tw-flex-1 tw-bg-border",
      "data-[orientation=vertical]:tw-h-8 data-[orientation=vertical]:tw-w-[2px]",
      "group-data-[state=complete]:tw-bg-primary",
      className,
    )}
    {...props}
  />
));

StepsSeparator.displayName = "StepsSeparator";

const StepsContent = forwardRef<
  ElementRef<typeof ArkSteps.Content>,
  ComponentPropsWithoutRef<typeof ArkSteps.Content>
>(({ className, ...props }, ref) => (
  <ArkSteps.Content
    ref={ref}
    className={cn("tw-mt-4 tw-text-sm", className)}
    {...props}
  />
));

StepsContent.displayName = "StepsContent";

const StepsCompletedContent = forwardRef<
  ElementRef<typeof ArkSteps.CompletedContent>,
  ComponentPropsWithoutRef<typeof ArkSteps.CompletedContent>
>(({ className, ...props }, ref) => (
  <ArkSteps.CompletedContent
    ref={ref}
    className={cn("tw-mt-4 tw-text-sm", className)}
    {...props}
  />
));

StepsCompletedContent.displayName = "StepsCompletedContent";

const StepsPrevTrigger = forwardRef<
  ElementRef<typeof ArkSteps.PrevTrigger>,
  ComponentPropsWithoutRef<typeof ArkSteps.PrevTrigger>
>(({ children, ...props }, ref) => (
  <ArkSteps.PrevTrigger ref={ref} {...props} asChild>
    <Button variant="ghost" size="lg">
      {children}
    </Button>
  </ArkSteps.PrevTrigger>
));

StepsPrevTrigger.displayName = "StepsPrevTrigger";

const StepsNextTrigger = forwardRef<
  ElementRef<typeof ArkSteps.NextTrigger>,
  ComponentPropsWithoutRef<typeof ArkSteps.NextTrigger>
>(({ children, ...props }, ref) => (
  <ArkSteps.NextTrigger ref={ref} {...props} asChild>
    <Button variant="default" size="lg">
      {children}
    </Button>
  </ArkSteps.NextTrigger>
));

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
