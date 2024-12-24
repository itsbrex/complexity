import { ComponentProps } from "react";
import { LuCheck as Check, LuCopy as Copy } from "react-icons/lu";

import useToggleButtonText from "@/hooks/useToggleButtonText";

type CopyButtonProps = ComponentProps<"div"> & {
  content?: string;
  onCopy?: () => void;
  disabled?: boolean;
  iconProps?: ComponentProps<"svg">;
};

export default function CopyButton({
  content,
  onCopy,
  className,
  disabled,
  iconProps,
  onClick,
  ...props
}: CopyButtonProps) {
  const [copyButtonText, setCopyButtonText] = useToggleButtonText({
    defaultText: (
      <Copy {...iconProps} className={cn("tw-size-4", iconProps?.className)} />
    ),
  });

  return (
    <div
      className={cn(
        "tw-w-max tw-cursor-pointer tw-text-muted-foreground tw-transition-all hover:tw-text-foreground active:tw-scale-95",
        {
          "tw-pointer-events-none tw-opacity-50": disabled,
        },
        className,
      )}
      onClick={(e) => {
        if (content && !onCopy) {
          navigator.clipboard.writeText(content);
        } else {
          onCopy?.();
        }

        setCopyButtonText(
          <Check
            {...iconProps}
            className={cn("tw-size-4", iconProps?.className)}
          />,
        );

        onClick?.(e);
      }}
      {...props}
    >
      {copyButtonText}
    </div>
  );
}
