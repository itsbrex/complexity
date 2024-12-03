import { Combobox as ArkCombobox, Portal } from "@ark-ui/react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type ElementRef,
  type ComponentPropsWithoutRef,
  createContext,
  useContext,
} from "react";
import {
  LuChevronDown as ChevronDown,
  LuX as ClearIcon,
  LuCheck,
  LuX,
} from "react-icons/lu";

import { cn } from "@/utils/cn";
import { untrapWheel } from "@/utils/utils";

type ComboboxContext = {
  portal: boolean;
};

const ComboboxContext = createContext<ComboboxContext>({
  portal: true,
});

const ComboboxContextProvider = ComboboxContext.Provider;

function Combobox({
  portal,
  ...props
}: ComponentPropsWithoutRef<typeof ArkCombobox.Root> & {
  portal?: boolean;
}) {
  return (
    <ComboboxContextProvider
      value={{
        portal: portal ?? true,
      }}
    >
      <ArkCombobox.Root unmountOnExit={false} lazyMount={true} {...props} />
    </ComboboxContextProvider>
  );
}

Combobox.displayName = "Combobox";

const comboboxTriggerVariants = cva(
  "tw-flex tw-w-full tw-items-center tw-justify-between tw-rounded-md tw-px-2 tw-text-sm tw-font-medium tw-outline-none tw-transition-all tw-duration-150 placeholder:tw-text-muted-foreground disabled:tw-cursor-not-allowed disabled:tw-opacity-50",
  {
    variants: {
      variant: {
        default:
          "active:scale-95 tw-bg-button-background hover:tw-text-muted-foreground focus:tw-outline-none",
        ghost:
          "text-center tw-text-muted-foreground hover:tw-bg-primary-foreground hover:tw-text-foreground active:tw-scale-95",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const ComboboxTrigger = forwardRef<
  ElementRef<typeof ArkCombobox.Trigger>,
  ComponentPropsWithoutRef<typeof ArkCombobox.Trigger> &
    VariantProps<typeof comboboxTriggerVariants>
>(({ variant, className, children, ...props }, ref) => {
  return (
    <ArkCombobox.Trigger
      ref={ref}
      className={cn(comboboxTriggerVariants({ variant }), className)}
      {...props}
    >
      {children}
      <ChevronDown className="tw-ml-2 tw-size-4 tw-text-muted-foreground" />
    </ArkCombobox.Trigger>
  );
});

ComboboxTrigger.displayName = "ComboboxTrigger";

const ComboboxInput = forwardRef<
  ElementRef<typeof ArkCombobox.Input>,
  ComponentPropsWithoutRef<typeof ArkCombobox.Input>
>(({ className, ...props }, ref) => {
  return (
    <div className="tw-relative tw-w-full">
      <ArkCombobox.Control>
        <ArkCombobox.Input
          ref={ref}
          className={cn(
            "tw-flex tw-h-9 tw-w-full tw-rounded-md tw-border tw-border-input tw-bg-transparent tw-px-3 tw-py-1 tw-text-sm tw-shadow-sm tw-transition-colors",
            "placeholder:tw-text-muted-foreground",
            "focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-ring",
            "disabled:tw-cursor-not-allowed disabled:tw-opacity-50",
            className,
          )}
          {...props}
        />
      </ArkCombobox.Control>
    </div>
  );
});

const ComboboxInputMultipleValues = forwardRef<
  ElementRef<typeof ArkCombobox.Input>,
  ComponentPropsWithoutRef<typeof ArkCombobox.Input>
>(({ className, placeholder, ...props }, ref) => {
  return (
    <div className="tw-relative tw-w-full">
      <ArkCombobox.Control>
        <div className="tw-flex tw-h-auto tw-min-h-[36px] tw-w-full tw-flex-wrap tw-gap-1.5 tw-rounded-md tw-border tw-border-input tw-bg-transparent tw-px-3 tw-py-1.5 tw-text-sm tw-shadow-sm tw-transition-colors focus-within:tw-ring-1 focus-within:tw-ring-ring">
          <ArkCombobox.Label asChild>
            <div className="tw-flex tw-flex-wrap tw-gap-1.5">
              <ArkCombobox.Context>
                {({ value, setValue }) =>
                  value.map((item) => (
                    <span
                      key={item}
                      className="tw-flex tw-items-center tw-gap-1 tw-rounded-md tw-bg-secondary tw-px-2 tw-py-0.5 tw-text-sm"
                    >
                      {item}
                      <button
                        className="tw-ml-1 tw-rounded-sm tw-text-muted-foreground hover:tw-text-foreground focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-ring"
                        onClick={(e) => {
                          e.preventDefault();
                          setValue(value.filter((v) => v !== item));
                        }}
                      >
                        <LuX className="tw-size-3" />
                      </button>
                    </span>
                  ))
                }
              </ArkCombobox.Context>
            </div>
          </ArkCombobox.Label>
          <ArkCombobox.Input
            ref={ref}
            placeholder={placeholder}
            className={cn(
              "tw-flex-1 tw-bg-transparent tw-outline-none placeholder:tw-text-muted-foreground disabled:tw-cursor-not-allowed disabled:tw-opacity-50",
              className,
            )}
            {...props}
          />
        </div>
      </ArkCombobox.Control>
    </div>
  );
});

ComboboxInputMultipleValues.displayName = "ComboboxInputMultipleValues";

ComboboxInput.displayName = "ComboboxInput";

const ComboboxClearTrigger = forwardRef<
  ElementRef<typeof ArkCombobox.ClearTrigger>,
  ComponentPropsWithoutRef<typeof ArkCombobox.ClearTrigger>
>(({ className, children, ...props }, ref) => {
  return (
    <ArkCombobox.ClearTrigger
      ref={ref}
      className={cn(
        "tw-absolute tw-right-2 tw-top-2 tw-rounded-sm tw-opacity-70 tw-ring-offset-background tw-transition-opacity",
        "hover:tw-opacity-100",
        "focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-ring focus:tw-ring-offset-2",
        "disabled:tw-pointer-events-none",
        className,
      )}
      {...props}
    >
      {children ?? <ClearIcon className="tw-size-4" />}
    </ArkCombobox.ClearTrigger>
  );
});

ComboboxClearTrigger.displayName = "ComboboxClearTrigger";

const ComboboxContent = forwardRef<
  ElementRef<typeof ArkCombobox.Content>,
  ComponentPropsWithoutRef<typeof ArkCombobox.Content>
>(({ className, ...props }, ref) => {
  const { portal } = useContext(ComboboxContext);

  if (typeof portal === "undefined") {
    throw new Error("ComboboxContent must be a child of Combobox");
  }

  const Comp = portal ? Portal : Slot;

  return (
    <Comp>
      <ArkCombobox.Positioner>
        <ArkCombobox.Content
          ref={ref}
          className={cn(
            "custom-scrollbar tw-z-50 tw-max-h-[300px] tw-min-w-[8rem] tw-overflow-auto tw-rounded-md tw-border tw-border-border/50 tw-bg-popover tw-p-1 tw-text-popover-foreground tw-shadow-md",
            "data-[state=open]:tw-animate-in data-[state=closed]:tw-animate-out",
            "data-[state=closed]:tw-fade-out-0 data-[state=open]:tw-fade-in-0",
            className,
          )}
          onWheel={untrapWheel}
          {...props}
        />
      </ArkCombobox.Positioner>
    </Comp>
  );
});

ComboboxContent.displayName = "ComboboxContent";

const ComboboxItem = forwardRef<
  ElementRef<typeof ArkCombobox.Item>,
  ComponentPropsWithoutRef<typeof ArkCombobox.Item>
>(({ className, children, ...props }, ref) => {
  return (
    <ArkCombobox.Item
      ref={ref}
      className={cn(
        "tw-relative tw-flex tw-w-full tw-cursor-pointer tw-select-none tw-items-center tw-rounded-sm tw-px-2 tw-py-1.5 tw-text-sm tw-outline-none",
        "data-[disabled]:tw-pointer-events-none data-[disabled]:tw-opacity-50",
        "data-[highlighted]:tw-bg-primary-foreground data-[highlighted]:tw-text-primary",
        className,
      )}
      {...props}
    >
      <span className="tw-absolute tw-left-2 tw-flex tw-size-3.5 tw-items-center tw-justify-center">
        <ArkCombobox.ItemIndicator>
          <LuCheck className="tw-size-3.5" />
        </ArkCombobox.ItemIndicator>
      </span>
      <ArkCombobox.ItemText className="tw-ml-6">
        {children}
      </ArkCombobox.ItemText>
    </ArkCombobox.Item>
  );
});

ComboboxItem.displayName = "ComboboxItem";

const ComboboxGroup = ArkCombobox.ItemGroup;

const ComboboxLabel = forwardRef<
  ElementRef<typeof ArkCombobox.Label>,
  ComponentPropsWithoutRef<typeof ArkCombobox.Label>
>(({ className, ...props }, ref) => {
  return (
    <ArkCombobox.Label
      ref={ref}
      className={cn(
        "tw-mb-2 tw-block tw-text-xs tw-font-medium tw-text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
});

ComboboxLabel.displayName = "ComboboxLabel";

const ComboboxItemGroupLabel = forwardRef<
  ElementRef<typeof ArkCombobox.ItemGroupLabel>,
  ComponentPropsWithoutRef<typeof ArkCombobox.ItemGroupLabel>
>(({ className, ...props }, ref) => {
  return (
    <ArkCombobox.ItemGroupLabel
      ref={ref}
      className={cn(
        "tw-py-1.5 tw-pl-2 tw-pr-2 tw-text-xs tw-text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
});

ComboboxItemGroupLabel.displayName = "ComboboxItemGroupLabel";

export {
  Combobox,
  ComboboxTrigger,
  ComboboxInput,
  ComboboxInputMultipleValues,
  ComboboxContent,
  ComboboxItem,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxClearTrigger,
  ComboboxItemGroupLabel,
};
