import { type LabelHTMLAttributes } from "react";

const Label = ({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) => {
  return (
    <label
      className={cn(
        "tw-text-sm tw-font-medium tw-leading-none peer-disabled:tw-cursor-not-allowed peer-disabled:tw-opacity-70",
        className,
      )}
      {...props}
    />
  );
};

Label.displayName = "Label";

export { Label };
