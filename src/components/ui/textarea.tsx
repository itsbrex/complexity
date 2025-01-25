import { ComponentProps } from "react";

type TextareaProps = ComponentProps<"textarea">;

const Textarea = ({ className, ...props }: TextareaProps) => {
  return (
    <textarea
      className={cn(
        "x-flex x-min-h-[80px] x-w-full x-rounded-md x-border x-border-input/50 x-bg-background x-px-3 x-py-2 x-font-sans x-text-sm x-ring-offset-background placeholder:x-text-muted-foreground focus-visible:x-outline-none focus-visible:x-ring-2 focus-visible:x-ring-ring focus-visible:x-ring-offset-2 disabled:x-cursor-not-allowed disabled:x-opacity-50",
        className,
      )}
      {...props}
    />
  );
};

Textarea.displayName = "Textarea";

export { Textarea };
