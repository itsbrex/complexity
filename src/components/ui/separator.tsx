import { type HTMLAttributes } from "react";

type SeparatorProps = HTMLAttributes<HTMLDivElement> & {
  orientation?: "horizontal" | "vertical";
};

const Separator = ({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorProps) => {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        "tw-shrink-0 tw-bg-border",
        orientation === "horizontal"
          ? "tw-h-[1px] tw-w-full"
          : "tw-h-full tw-w-[1px]",
        className,
      )}
      {...props}
    />
  );
};

Separator.displayName = "Separator";

export { Separator };
