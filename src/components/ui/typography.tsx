export function H1({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        "tw-scroll-m-20 tw-text-3xl tw-font-extrabold tw-tracking-tight md:tw-text-4xl lg:tw-text-5xl",
        className,
      )}
      {...props}
    />
  );
}

export function H2({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "tw-scroll-m-20 tw-pb-2 tw-text-2xl tw-font-semibold tw-tracking-tight first:tw-mt-0 md:tw-text-3xl lg:tw-text-4xl",
        className,
      )}
      {...props}
    />
  );
}

export function H3({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "tw-scroll-m-20 tw-text-xl tw-font-semibold tw-tracking-tight md:tw-text-2xl lg:tw-text-3xl",
        className,
      )}
      {...props}
    />
  );
}

export function H4({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4
      className={cn(
        "tw-scroll-m-20 tw-text-lg tw-font-semibold tw-tracking-tight md:tw-text-xl lg:tw-text-2xl",
        className,
      )}
      {...props}
    />
  );
}

export function P({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("[&:not(:first-child)]:tw-mt-6", className)} {...props} />
  );
}

export function Blockquote({
  className,
  ...props
}: React.HTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className={cn("tw-mt-6 tw-border-l-2 tw-pl-6 tw-italic", className)}
      {...props}
    />
  );
}

export function InlineCode({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn(
        "tw-relative tw-rounded tw-bg-muted tw-px-[0.3rem] tw-py-[0.2rem] tw-font-mono tw-text-sm tw-font-semibold",
        className,
      )}
      {...props}
    />
  );
}

export function Ul({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={cn("tw-my-6 tw-ml-6 tw-list-disc [&>li]:tw-mt-2", className)}
      {...props}
    />
  );
}
