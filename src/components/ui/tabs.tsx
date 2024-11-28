import { Tabs as ArkTabs, useTabsContext } from "@ark-ui/react";
import { forwardRef, type ElementRef } from "react";

const Tabs = ArkTabs.Root;

const TabsTrigger = forwardRef<
  ElementRef<typeof ArkTabs.Trigger>,
  ArkTabs.TriggerProps
>(({ value, className, ...props }, ref) => {
  const { value: selectedValue } = useTabsContext();

  return (
    <ArkTabs.Trigger
      ref={ref}
      value={value}
      className={cn(
        "tw-inline-flex tw-items-center tw-whitespace-nowrap tw-rounded-md tw-px-3 tw-py-1.5 tw-text-sm tw-font-medium tw-ring-offset-background tw-transition-all hover:tw-text-foreground focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 disabled:tw-pointer-events-none disabled:tw-opacity-50",
        "data-[state=active]:tw-bg-primary/10 data-[state=active]:tw-text-primary data-[state=active]:tw-shadow-sm",
        "data-[orientation=horizontal]:tw-justify-center",
        "data-[orientation=vertical]:tw-w-full",
        className,
      )}
      data-state={selectedValue === value ? "active" : undefined}
      {...props}
    />
  );
});

TabsTrigger.displayName = "TabsTrigger";

const TabsList = forwardRef<ElementRef<typeof ArkTabs.List>, ArkTabs.ListProps>(
  ({ className, ...props }, ref) => (
    <ArkTabs.List
      ref={ref}
      className={cn(
        "tw-inline-flex tw-items-center tw-justify-center tw-rounded-md tw-p-1 tw-text-muted-foreground",
        "data-[orientation=horizontal]:tw-flex-wrap data-[orientation=horizontal]:tw-gap-2",
        "data-[orientation=vertical]:tw-h-max data-[orientation=vertical]:tw-flex-col data-[orientation=vertical]:tw-gap-1",
        className,
      )}
      {...props}
    />
  ),
);

TabsList.displayName = "TabsList";

const TabsContent = forwardRef<
  ElementRef<typeof ArkTabs.Content>,
  ArkTabs.ContentProps
>(({ className, ...props }, ref) => (
  <ArkTabs.Content
    ref={ref}
    className={cn(
      "tw-ring-offset-background focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2",
      className,
    )}
    {...props}
  />
));

TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
