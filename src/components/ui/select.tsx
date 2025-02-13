import { Portal, Select as ArkSelect } from "@ark-ui/react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ComponentProps, createContext, use } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { LuChevronDown as ChevronDown } from "react-icons/lu";

import { untrapWheel } from "@/utils/utils";

type SelectLocalContext = {
  portal: boolean;
};

const SelectLocalContext = createContext<SelectLocalContext>({
  portal: true,
});

const SelectLocalContextProvider = SelectLocalContext.Provider;

const SelectContext = ArkSelect.Context;

function Select({
  portal,
  ...props
}: ComponentProps<typeof ArkSelect.Root> & {
  portal?: boolean;
}) {
  return (
    <SelectLocalContextProvider
      value={{
        portal: portal ?? true,
      }}
    >
      <ArkSelect.Root unmountOnExit={false} lazyMount={true} {...props} />
    </SelectLocalContextProvider>
  );
}

Select.displayName = "Select";

const selectTriggerVariants = cva(
  "x-flex x-w-full x-items-center x-justify-between x-rounded-md x-px-2 x-text-sm x-font-medium x-outline-none x-transition-all x-duration-150 placeholder:x-text-muted-foreground focus-visible:x-bg-primary-foreground disabled:x-cursor-not-allowed disabled:x-opacity-50 [&>span]:!x-truncate",
  {
    variants: {
      variant: {
        default:
          "active:scale-95 x-bg-buttonBackground hover:x-text-muted-foreground focus:x-outline-none",
        ghost:
          "x-text-center x-text-muted-foreground hover:x-bg-primary-foreground hover:x-text-foreground active:x-scale-95",
        noStyle: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type SelectTriggerProps = ArkSelect.TriggerProps &
  VariantProps<typeof selectTriggerVariants>;

const SelectTrigger = ({
  variant = "default",
  className,
  children,
  ...props
}: SelectTriggerProps) => {
  return (
    <ArkSelect.Trigger
      className={cn(selectTriggerVariants({ variant }), className)}
      {...props}
    >
      {children}
      {variant === "default" && (
        <ChevronDown className="x-ml-2 x-size-4 x-text-muted-foreground" />
      )}
    </ArkSelect.Trigger>
  );
};

SelectTrigger.displayName = "SelectTrigger";

export type SelectValueProps = ArkSelect.ValueTextProps;

const SelectValue = ({ className, ...props }: SelectValueProps) => {
  return (
    <ArkSelect.ValueText className={cn("x-truncate", className)} {...props} />
  );
};

SelectValue.displayName = "SelectValue";

export type SelectContentProps = ComponentProps<typeof ArkSelect.Content>;

const SelectContent = ({ className, ...props }: SelectContentProps) => {
  const { portal } = use(SelectLocalContext);

  if (typeof portal === "undefined") {
    throw new Error("SelectContent must be a child of Select");
  }

  const Comp = portal ? Portal : Slot;

  return (
    <Comp>
      <ArkSelect.Positioner>
        <ArkSelect.Content
          className={cn(
            "custom-scrollbar x-z-50 x-overflow-auto x-rounded-md x-border x-border-border/50 x-bg-popover x-p-2 x-text-popover-foreground x-shadow-md focus-visible:x-outline-none",
            "data-[state=open]:x-animate-in data-[state=closed]:x-animate-out",
            "data-[state=closed]:x-fade-out-0 data-[state=open]:x-fade-in-0",
            "data-[state=closed]:x-zoom-out-95 data-[state=open]:x-zoom-in-95",
            "data-[side=bottom]:x-slide-in-from-top-2 data-[side=left]:x-slide-in-from-right-2",
            "data-[side=right]:x-slide-in-from-left-2 data-[side=top]:x-slide-in-from-bottom-2",
            className,
          )}
          onWheel={untrapWheel}
          {...props}
        />
      </ArkSelect.Positioner>
    </Comp>
  );
};

SelectContent.displayName = "SelectContent";

const SelectGroup = ArkSelect.ItemGroup;

export type SelectLabelProps = ArkSelect.LabelProps;

const SelectLabel = ({ className, ...props }: SelectLabelProps) => {
  return (
    <ArkSelect.Label
      className={cn(
        "x-py-1.5 x-pl-2 x-pr-2 x-text-xs x-text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
};

SelectLabel.displayName = "SelectLabel";

export type SelectItemProps = ArkSelect.ItemProps & {
  checkboxOnSingleItem?: boolean;
  item: string;
};

const SelectItem = ({
  className,
  children,
  checkboxOnSingleItem = false,
  ...props
}: SelectItemProps) => {
  return (
    <ArkSelect.Context>
      {({ multiple, value }) => (
        <ArkSelect.Item
          className={cn(
            "x-relative x-flex x-cursor-pointer x-select-none x-items-center x-rounded-sm x-px-2 x-py-1.5 x-text-sm x-outline-none",
            "data-[disabled]:x-cursor-not-allowed data-[disabled]:x-opacity-50",
            "x-transition-all data-[highlighted]:x-bg-primary-foreground",
            "x-justify-between x-text-muted-foreground data-[state=checked]:x-text-primary",
            {
              "x-flex x-justify-between": multiple,
            },
            className,
          )}
          {...props}
        >
          {children}
          {(multiple || checkboxOnSingleItem) && value.includes(props.item) && (
            <FaCheckCircle className="x-ml-auto x-size-4 x-shrink-0" />
          )}
        </ArkSelect.Item>
      )}
    </ArkSelect.Context>
  );
};

SelectItem.displayName = "SelectItem";

export {
  Select,
  SelectContext,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
};
