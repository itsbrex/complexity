import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes } from "react";
import { LuSparkles } from "react-icons/lu";
import { TbBugOff } from "react-icons/tb";

const blockVariants = cva("tw-rounded-md tw-p-4", {
  variants: {
    variant: {
      new: "tw-bg-primary/10 [&_[data-releasenote-part='header']]:tw-text-primary [&_strong]:tw-text-foreground",
      "bug-fix":
        "tw-bg-destructive/10 [&_[data-releasenote-part='header']]:tw-text-destructive [&_strong]:tw-text-foreground",
      improvement:
        "tw-bg-success/10 [&_[data-releasenote-part='header']]:tw-text-success [&_strong]:tw-text-success-foreground",
      change: "tw-bg-secondary tw-text-foreground",
    },
  },
  defaultVariants: {
    variant: "new",
  },
});

const ICON = {
  new: LuSparkles,
  "bug-fix": TbBugOff,
  improvement: LuSparkles,
  change: LuSparkles,
};

const HEADER_TEXT = {
  new: "What's New",
  "bug-fix": "Bug Fixes",
  improvement: "Improvements",
  change: "Changes",
};

export default function NewItems({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  "data-description"?: string;
  "data-variant"?: VariantProps<typeof blockVariants>["variant"];
}) {
  const Icon = props["data-variant"] ? ICON[props["data-variant"]] : null;
  const headerText = props["data-variant"]
    ? HEADER_TEXT[props["data-variant"]]
    : null;

  return (
    <div
      data-release-note-part="wrapper"
      className={cn(
        blockVariants({ variant: props["data-variant"] }),
        className,
      )}
      {...props}
    >
      <div className="tw-flex tw-flex-col tw-gap-2">
        <div
          className="tw-flex tw-items-center tw-gap-2"
          data-releasenote-part="header"
        >
          {Icon && <Icon className="tw-size-8" />}
          <span className="tw-text-2xl tw-font-semibold tw-uppercase">
            {headerText}
          </span>
        </div>
        {props["data-description"] && (
          <span className="tw-ml-8 tw-text-sm tw-text-muted-foreground">
            {props["data-description"]}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
