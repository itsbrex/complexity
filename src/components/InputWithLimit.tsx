export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  limit?: number;
  triggerCounterLimitOffset?: number;
};

export default forwardRef<HTMLInputElement, InputProps>(function InputWithLimit(
  { className, type, limit, triggerCounterLimitOffset = 10, ...props },
  ref,
) {
  const [value, setValue] = useState(
    ((props.defaultValue ?? props.value) as string) || "",
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <div className="x-relative">
      <input
        ref={ref}
        type={type}
        className={cn(
          "x-flex x-h-10 x-w-full x-rounded-md x-border x-border-input x-bg-background x-px-3 x-py-2 x-text-sm x-ring-offset-background file:x-border-0 file:x-bg-transparent file:x-text-sm file:x-font-medium placeholder:x-text-muted-foreground focus-visible:x-outline-none focus-visible:x-ring-2 focus-visible:x-ring-ring focus-visible:x-ring-offset-2 disabled:x-cursor-not-allowed disabled:x-opacity-50",
          className,
        )}
        {...props}
        onChange={(value) => {
          handleChange(value);
          props?.onChange?.(value);
        }}
      />
      {limit != null && value.length >= limit - triggerCounterLimitOffset && (
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
            {value.length}/{limit}
          </div>
        </div>
      )}
    </div>
  );
});
