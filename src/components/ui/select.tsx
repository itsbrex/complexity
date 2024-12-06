import { Portal, Select as ArkSelect } from "@ark-ui/react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type ElementRef,
  type ComponentPropsWithoutRef,
  createContext,
  useContext,
} from "react";
import { LuChevronDown as ChevronDown, LuCheck } from "react-icons/lu";

import { untrapWheel } from "@/utils/utils";

type SelectContext = {
  portal: boolean;
};

const SelectContext = createContext<SelectContext>({
  portal: true,
});

const SelectContextProvider = SelectContext.Provider;

function Select({
  portal,
  ...props
}: ComponentPropsWithoutRef<typeof ArkSelect.Root> & {
  portal?: boolean;
}) {
  return (
    <SelectContextProvider
      value={{
        portal: portal ?? true,
      }}
    >
      <ArkSelect.Root unmountOnExit={false} lazyMount={true} {...props} />
    </SelectContextProvider>
  );
}

Select.displayName = "Select";

const selectTriggerVariants = cva(
  "tw-flex tw-w-full tw-items-center tw-justify-between tw-rounded-md tw-px-2 tw-text-sm tw-font-medium tw-outline-none tw-transition-all tw-duration-150 placeholder:tw-text-muted-foreground disabled:tw-cursor-not-allowed disabled:tw-opacity-50 [&>span]:!tw-truncate focus-visible:tw-bg-primary-foreground",
  {
    variants: {
      variant: {
        default:
          "active:scale-95 tw-bg-button-background hover:tw-text-muted-foreground focus:tw-outline-none",
        ghost:
          "tw-text-center tw-text-muted-foreground hover:tw-bg-primary-foreground hover:tw-text-foreground active:tw-scale-95",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type SelectTriggerProps = ArkSelect.TriggerProps &
  VariantProps<typeof selectTriggerVariants>;

const SelectTrigger = forwardRef<
  ElementRef<typeof ArkSelect.Trigger>,
  SelectTriggerProps
>(({ variant, className, children, ...props }, ref) => {
  return (
    <ArkSelect.Trigger
      ref={ref}
      className={cn(selectTriggerVariants({ variant }), className)}
      {...props}
    >
      {children}
      {variant === "default" && (
        <ChevronDown className="tw-ml-2 tw-size-4 tw-text-muted-foreground" />
      )}
    </ArkSelect.Trigger>
  );
});

SelectTrigger.displayName = "SelectTrigger";

export type SelectValueProps = ArkSelect.ValueTextProps;

const SelectValue = forwardRef<
  ElementRef<typeof ArkSelect.ValueText>,
  SelectValueProps
>(({ className, ...props }, ref) => {
  return (
    <ArkSelect.ValueText
      ref={ref}
      className={cn("tw-truncate", className)}
      {...props}
    />
  );
});

SelectValue.displayName = "SelectValue";

export type SelectContentProps = ArkSelect.ContentProps;

const SelectContent = forwardRef<
  ElementRef<typeof ArkSelect.Content>,
  SelectContentProps
>(({ className, ...props }, ref) => {
  const { portal } = useContext(SelectContext);

  if (typeof portal === "undefined") {
    throw new Error("SelectContent must be a child of Select");
  }

  const Comp = portal ? Portal : Slot;

  return (
    <Comp>
      <ArkSelect.Positioner>
        <ArkSelect.Content
          ref={ref}
          className={cn(
            "custom-scrollbar tw-z-50 tw-overflow-auto tw-rounded-md tw-border tw-border-border/50 tw-bg-popover tw-p-1 tw-text-popover-foreground tw-shadow-md focus-visible:tw-outline-none",
            "data-[state=open]:tw-animate-in data-[state=closed]:tw-animate-out",
            "data-[state=closed]:tw-fade-out-0 data-[state=open]:tw-fade-in-0",
            "data-[state=closed]:tw-zoom-out-95 data-[state=open]:tw-zoom-in-95",
            "data-[side=bottom]:tw-slide-in-from-top-2 data-[side=left]:tw-slide-in-from-right-2",
            "data-[side=right]:tw-slide-in-from-left-2 data-[side=top]:tw-slide-in-from-bottom-2",
            className,
          )}
          onWheel={untrapWheel}
          {...props}
        />
      </ArkSelect.Positioner>
    </Comp>
  );
});

SelectContent.displayName = "SelectContent";

const SelectGroup = ArkSelect.ItemGroup;

export type SelectLabelProps = ArkSelect.LabelProps;

const SelectLabel = forwardRef<
  ElementRef<typeof ArkSelect.Label>,
  SelectLabelProps
>(({ className, ...props }, ref) => {
  return (
    <ArkSelect.Label
      ref={ref}
      className={cn(
        "tw-py-1.5 tw-pl-2 tw-pr-2 tw-text-xs tw-text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
});

SelectLabel.displayName = "SelectLabel";

export type SelectItemProps = ArkSelect.ItemProps & {
  item: string;
};

const SelectItem = forwardRef<
  ElementRef<typeof ArkSelect.Item>,
  SelectItemProps
>(({ className, children, ...props }, ref) => {
  return (
    <ArkSelect.Context>
      {({ multiple, value }) => (
        <ArkSelect.Item
          ref={ref}
          className={cn(
            "tw-relative tw-flex tw-cursor-pointer tw-select-none tw-items-center tw-rounded-sm tw-px-2 tw-py-1.5 tw-text-sm tw-outline-none",
            "data-[disabled]:tw-cursor-not-allowed data-[disabled]:tw-opacity-50",
            "data-[highlighted]:tw-bg-primary-foreground",
            "data-[state=checked]:tw-text-primary",
            {
              "tw-flex tw-justify-between": multiple,
            },
            className,
          )}
          {...props}
        >
          {children}
          {multiple && value.includes(props.item) && (
            <LuCheck className="tw-size-4" />
          )}
        </ArkSelect.Item>
      )}
    </ArkSelect.Context>
  );
});

SelectItem.displayName = "SelectItem";

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
};
