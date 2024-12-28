import { Slot } from "@radix-ui/react-slot";
import { ComponentProps, type ReactNode } from "react";
import { LuChevronRight, LuEllipsis } from "react-icons/lu";

type BreadcrumbProps = ComponentProps<"nav"> & {
  separator?: ReactNode;
  collapsed?: boolean;
};

const Breadcrumb = ({
  collapsed = true,
  className,
  ...props
}: BreadcrumbProps) => (
  <nav
    aria-label="breadcrumb"
    data-collapsed={collapsed}
    className={cn("tw-w-full tw-overflow-hidden", className)}
    {...props}
  />
);
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = ({ className, ...props }: ComponentProps<"ol">) => (
  <ol
    className={cn(
      "tw-flex tw-items-center tw-gap-1.5 tw-text-sm tw-text-muted-foreground",
      className,
    )}
    {...props}
  />
);
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = ({ className, ...props }: ComponentProps<"li">) => (
  <li
    data-item=""
    className={cn("tw-flex tw-shrink-0 tw-items-center", className)}
    {...props}
  />
);
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = ({
  asChild,
  className,
  ...props
}: ComponentProps<"a"> & {
  asChild?: boolean;
}) => {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      className={cn("tw-transition-colors hover:tw-text-foreground", className)}
      {...props}
    />
  );
};
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = ({ className, ...props }: ComponentProps<"span">) => (
  <span
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("tw-font-normal tw-text-foreground", className)}
    {...props}
  />
);
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    data-separator=""
    className={cn("[&>svg]:tw-h-3.5 [&>svg]:tw-w-3.5", className)}
    {...props}
  >
    {children ?? <LuChevronRight />}
  </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = ({
  className,
  ...props
}: ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn(
      "tw-flex tw-h-9 tw-w-9 tw-items-center tw-justify-center",
      className,
    )}
    {...props}
  >
    <LuEllipsis className="tw-h-4 tw-w-4" />
    <span className="tw-sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
