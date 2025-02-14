import { ComponentProps } from "react";

export type TextareaProps = ComponentProps<"textarea"> & {
  limit?: number;
  triggerCounterLimitOffset?: number;
};

export default function TextareaWithLimit({
  className,
  limit,
  triggerCounterLimitOffset = 0,
  ...props
}: TextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState(
    ((props.defaultValue ?? props.value) as string) || "",
  );

  useEffect(() => {
    setValue(((props.defaultValue ?? props.value) as string) || "");
  }, [props.value, props.defaultValue]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  return (
    <div className="x-relative x-h-full x-w-full">
      <textarea
        ref={textareaRef}
        className={cn(
          "x-flex x-min-h-[80px] x-w-full x-rounded-md x-border x-border-input x-bg-background x-px-3 x-py-2 x-text-sm x-ring-offset-background placeholder:x-text-muted-foreground focus-visible:x-outline-none focus-visible:x-ring-2 focus-visible:x-ring-ring focus-visible:x-ring-offset-2 disabled:x-cursor-not-allowed disabled:x-opacity-50",
          className,
        )}
        {...props}
        onChange={(value) => {
          handleChange(value);
          props?.onChange?.(value);
        }}
      />
      {limit != null && value.length > limit - triggerCounterLimitOffset && (
        <div
          className={cn(
            "x-gap-sm x-pb-xs x-mb-xs x-absolute x-bottom-0 x-right-1 x-flex x-items-center x-rounded-full x-bg-background",
            {
              "x-text-red-500":
                value.length > limit - triggerCounterLimitOffset,
            },
          )}
        >
          <div className="x-font-sans x-text-xs x-font-medium">
            {limit - value.length}
          </div>
        </div>
      )}
    </div>
  );
}
