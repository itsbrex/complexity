import { Checkbox as ArkCheckbox } from "@ark-ui/react";
import { cva, type VariantProps } from "class-variance-authority";
import { ReactNode } from "react";
import { LuCheck } from "react-icons/lu";

const checkboxVariants = cva(
  "x-h-4 x-w-4 x-shrink-0 x-rounded-md x-border x-border-border x-ring-offset-background x-transition-all focus-visible:x-outline-none focus-visible:x-ring-2 focus-visible:x-ring-ring focus-visible:x-ring-offset-2 data-[state=checked]:x-bg-primary data-[state=checked]:x-text-primary-foreground group-data-[disabled]:x-cursor-not-allowed group-data-[disabled]:x-opacity-50",
  {
    variants: {
      size: {
        sm: "x-h-3 x-w-3",
        base: "x-h-4 x-w-4",
        lg: "x-h-5 x-w-5",
      },
    },
    defaultVariants: {
      size: "base",
    },
  },
);

const labelVariants = cva(
  "x-text-sm x-font-medium x-leading-none group-data-[disabled]:x-cursor-not-allowed group-data-[disabled]:x-opacity-70",
  {
    variants: {
      size: {
        sm: "x-text-xs",
        base: "x-text-sm",
        lg: "x-text-base",
      },
    },
    defaultVariants: {
      size: "base",
    },
  },
);

type CheckboxProps = ArkCheckbox.RootProps &
  VariantProps<typeof checkboxVariants> & {
    label?: ReactNode;
    labelClassName?: string;
  };

function Checkbox({
  label,
  labelClassName,
  className,
  size,
  ...props
}: CheckboxProps) {
  return (
    <ArkCheckbox.Root
      className={cn("x-group x-flex x-items-center x-gap-2", className)}
      {...props}
    >
      <ArkCheckbox.Control className={checkboxVariants({ size })}>
        <ArkCheckbox.Indicator>
          <LuCheck className="x-stroke-primary-foreground" />
        </ArkCheckbox.Indicator>
      </ArkCheckbox.Control>
      {label != null && label !== "" && (
        <ArkCheckbox.Label
          className={cn(labelVariants({ size }), labelClassName)}
        >
          {label}
        </ArkCheckbox.Label>
      )}
      <ArkCheckbox.HiddenInput />
    </ArkCheckbox.Root>
  );
}

Checkbox.displayName = "Checkbox";

export { Checkbox };
