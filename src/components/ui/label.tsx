import { type LabelHTMLAttributes } from "react";

const Label = ({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) => {
  return (
    <label
      className={cn(
        "x-text-sm x-font-medium x-leading-none peer-disabled:x-cursor-not-allowed peer-disabled:x-opacity-70",
        className,
      )}
      {...props}
    />
  );
};

Label.displayName = "Label";

export { Label };
