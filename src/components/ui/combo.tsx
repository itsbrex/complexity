import { Combobox as ArkCombobox, Portal } from "@ark-ui/react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ComponentProps, createContext, use } from "react";
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
}: ComponentProps<typeof ArkCombobox.Root> & {
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
  "x-flex x-w-full x-items-center x-justify-between x-rounded-md x-px-2 x-text-sm x-font-medium x-outline-none x-transition-all x-duration-150 placeholder:x-text-muted-foreground disabled:x-cursor-not-allowed disabled:x-opacity-50",
  {
    variants: {
      variant: {
        default:
          "active:scale-95 x-bg-buttonBackground hover:x-text-muted-foreground focus:x-outline-none",
        ghost:
          "text-center x-text-muted-foreground hover:x-bg-primary-foreground hover:x-text-foreground active:x-scale-95",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const ComboboxTrigger = ({
  variant,
  className,
  children,
  ...props
}: ArkCombobox.TriggerProps & {
  variant: VariantProps<typeof comboboxTriggerVariants>["variant"];
}) => {
  return (
    <ArkCombobox.Trigger
      className={cn(comboboxTriggerVariants({ variant }), className)}
      {...props}
    >
      {children}
      <ChevronDown className="x-ml-2 x-size-4 x-text-muted-foreground" />
    </ArkCombobox.Trigger>
  );
};

ComboboxTrigger.displayName = "ComboboxTrigger";

const ComboboxInput = ({ className, ...props }: ArkCombobox.InputProps) => {
  return (
    <div className="x-relative x-w-full">
      <ArkCombobox.Control>
        <ArkCombobox.Input
          className={cn(
            "x-flex x-h-9 x-w-full x-rounded-md x-border x-border-input x-bg-transparent x-px-3 x-py-1 x-text-sm x-shadow-sm x-transition-colors",
            "placeholder:x-text-muted-foreground",
            "focus:x-outline-none focus:x-ring-1 focus:x-ring-ring",
            "disabled:x-cursor-not-allowed disabled:x-opacity-50",
            className,
          )}
          {...props}
        />
      </ArkCombobox.Control>
    </div>
  );
};

const ComboboxInputMultipleValues = ({
  className,
  placeholder,
  ...props
}: ArkCombobox.InputProps) => {
  return (
    <div className="x-relative x-w-full">
      <ArkCombobox.Control>
        <div className="x-flex x-h-auto x-min-h-[36px] x-w-full x-flex-wrap x-gap-1.5 x-rounded-md x-border x-border-input x-bg-transparent x-px-3 x-py-1.5 x-text-sm x-shadow-sm x-transition-colors focus-within:x-ring-1 focus-within:x-ring-ring">
          <ArkCombobox.Label asChild>
            <div className="x-flex x-flex-wrap x-gap-1.5">
              <ArkCombobox.Context>
                {({ value, setValue }) =>
                  value.map((item) => (
                    <span
                      key={item}
                      className="x-flex x-items-center x-gap-1 x-rounded-md x-bg-secondary x-px-2 x-py-0.5 x-text-sm"
                    >
                      {item}
                      <button
                        className="x-ml-1 x-rounded-sm x-text-muted-foreground hover:x-text-foreground focus:x-outline-none focus:x-ring-2 focus:x-ring-ring"
                        onClick={(e) => {
                          e.preventDefault();
                          setValue(value.filter((v) => v !== item));
                        }}
                      >
                        <LuX className="x-size-3" />
                      </button>
                    </span>
                  ))
                }
              </ArkCombobox.Context>
            </div>
          </ArkCombobox.Label>
          <ArkCombobox.Input
            placeholder={placeholder}
            className={cn(
              "x-flex-1 x-bg-transparent x-outline-none placeholder:x-text-muted-foreground disabled:x-cursor-not-allowed disabled:x-opacity-50",
              className,
            )}
            {...props}
          />
        </div>
      </ArkCombobox.Control>
    </div>
  );
};

ComboboxInputMultipleValues.displayName = "ComboboxInputMultipleValues";

ComboboxInput.displayName = "ComboboxInput";

const ComboboxClearTrigger = ({
  className,
  children,
  ...props
}: ArkCombobox.ClearTriggerProps) => {
  return (
    <ArkCombobox.ClearTrigger
      className={cn(
        "x-absolute x-right-2 x-top-2 x-rounded-sm x-opacity-70 x-ring-offset-background x-transition-opacity",
        "hover:x-opacity-100",
        "focus:x-outline-none focus:x-ring-2 focus:x-ring-ring focus:x-ring-offset-2",
        "disabled:x-pointer-events-none",
        className,
      )}
      {...props}
    >
      {children ?? <ClearIcon className="x-size-4" />}
    </ArkCombobox.ClearTrigger>
  );
};

ComboboxClearTrigger.displayName = "ComboboxClearTrigger";

const ComboboxContent = ({ className, ...props }: ArkCombobox.ContentProps) => {
  const { portal } = use(ComboboxContext);

  if (typeof portal === "undefined") {
    throw new Error("ComboboxContent must be a child of Combobox");
  }

  const Comp = portal ? Portal : Slot;

  return (
    <Comp>
      <ArkCombobox.Positioner>
        <ArkCombobox.Content
          className={cn(
            "custom-scrollbar x-z-50 x-max-h-[300px] x-min-w-[8rem] x-overflow-auto x-rounded-md x-border x-border-border/50 x-bg-popover x-p-1 x-text-popover-foreground x-shadow-md",
            "data-[state=open]:x-animate-in data-[state=closed]:x-animate-out",
            "data-[state=closed]:x-fade-out-0 data-[state=open]:x-fade-in-0",
            className,
          )}
          onWheel={untrapWheel}
          {...props}
        />
      </ArkCombobox.Positioner>
    </Comp>
  );
};

ComboboxContent.displayName = "ComboboxContent";

const ComboboxItem = ({
  className,
  children,
  ...props
}: ArkCombobox.ItemProps) => {
  return (
    <ArkCombobox.Item
      className={cn(
        "x-relative x-flex x-w-full x-cursor-pointer x-select-none x-items-center x-rounded-sm x-px-2 x-py-1.5 x-text-sm x-outline-none",
        "data-[disabled]:x-pointer-events-none data-[disabled]:x-opacity-50",
        "data-[highlighted]:x-bg-primary-foreground data-[highlighted]:x-text-primary",
        className,
      )}
      {...props}
    >
      <span className="x-absolute x-left-2 x-flex x-size-3.5 x-items-center x-justify-center">
        <ArkCombobox.ItemIndicator>
          <LuCheck className="x-size-3.5" />
        </ArkCombobox.ItemIndicator>
      </span>
      <ArkCombobox.ItemText className="x-ml-6">{children}</ArkCombobox.ItemText>
    </ArkCombobox.Item>
  );
};

ComboboxItem.displayName = "ComboboxItem";

const ComboboxGroup = ArkCombobox.ItemGroup;

const ComboboxLabel = ({ className, ...props }: ArkCombobox.LabelProps) => {
  return (
    <ArkCombobox.Label
      className={cn(
        "x-mb-2 x-block x-text-xs x-font-medium x-text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
};

ComboboxLabel.displayName = "ComboboxLabel";

const ComboboxItemGroupLabel = ({
  className,
  ...props
}: ArkCombobox.ItemGroupLabelProps) => {
  return (
    <ArkCombobox.ItemGroupLabel
      className={cn(
        "x-py-1.5 x-pl-2 x-pr-2 x-text-xs x-text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
};

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
