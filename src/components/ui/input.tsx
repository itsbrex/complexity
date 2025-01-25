import { type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = ({ className, type, ...props }: InputProps) => {
  return (
    <input
      type={type}
      className={cn(
        "x-flex x-h-10 x-w-full x-rounded-md x-border x-border-input/50 x-bg-background x-px-3 x-py-2 x-font-sans x-text-sm x-ring-offset-background file:x-border-0 file:x-bg-transparent file:x-text-sm file:x-font-medium placeholder:x-text-muted-foreground focus-visible:x-outline-none focus-visible:x-ring-2 focus-visible:x-ring-ring focus-visible:x-ring-offset-2 disabled:x-cursor-not-allowed disabled:x-opacity-50",
        className,
      )}
      {...props}
    />
  );
};

Input.displayName = "Input";

export { Input };
