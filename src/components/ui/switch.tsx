import { Switch as ArkSwitch } from "@ark-ui/react";
import { ReactNode } from "react";

function Switch({
  textLabel,
  labelClassName,
  className,
  ...props
}: ArkSwitch.RootProps & {
  labelClassName?: string;
  textLabel?: ReactNode;
}) {
  return (
    <ArkSwitch.Root
      className={cn("x-flex x-items-center x-space-x-2", className)}
      {...props}
    >
      <ArkSwitch.Context>
        {({ checked }) => (
          <>
            <ArkSwitch.Control className="x-inline-flex x-h-6 x-w-11 x-shrink-0 x-cursor-pointer x-items-center x-space-x-2 x-rounded-full x-border x-border-border x-bg-transparent x-transition-all focus-visible:x-outline-none focus-visible:x-ring-1 focus-visible:x-ring-ring focus-visible:x-ring-offset-2 focus-visible:x-ring-offset-background data-[disabled]:x-cursor-not-allowed data-[disabled]:x-opacity-50 [&>span]:x-transition-all [&>span]:x-duration-150 [&>span]:hover:x-scale-95">
              <ArkSwitch.Thumb
                className={cn(
                  "x-pointer-events-none x-block x-h-4 x-w-4 x-rounded-full x-bg-muted-foreground x-shadow-lg x-ring-0",
                  "data-[state=checked]:x-translate-x-6 data-[state=checked]:x-bg-primary data-[state=checked]:x-text-primary",
                  "data-[state=unchecked]:x-translate-x-1",
                )}
              />
            </ArkSwitch.Control>
            {textLabel != null && textLabel !== "" && (
              <ArkSwitch.Label
                className={cn(
                  "x-duration-15 x-text-sm x-transition-colors",
                  "x-cursor-pointer data-[disabled]:x-cursor-not-allowed data-[state=unchecked]:x-text-muted-foreground data-[disabled]:x-opacity-50 hover:data-[state=unchecked]:x-text-foreground",
                  {
                    "x-text-primary": checked,
                  },
                  labelClassName,
                )}
              >
                {textLabel}
              </ArkSwitch.Label>
            )}
            <ArkSwitch.HiddenInput />
          </>
        )}
      </ArkSwitch.Context>
    </ArkSwitch.Root>
  );
}

Switch.displayName = "Switch";

export { Switch };
