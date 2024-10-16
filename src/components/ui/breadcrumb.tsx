import { Slot } from "@radix-ui/react-slot";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import {
  LuChevronRight as ChevronRight,
  LuMoreHorizontal as MoreHorizontal,
} from "react-icons/lu";

type BreadcrumbProps = ComponentPropsWithoutRef<"nav"> & {
  separator?: ReactNode;
  collapsed?: boolean;
};

const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ collapsed = true, className, ...props }, ref) => (
    <nav
      ref={ref}
      aria-label="breadcrumb"
      data-collapsed={collapsed}
      className={cn("tw-w-full tw-overflow-hidden", className)}
      {...props}
    />
  ),
);
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = forwardRef<
  HTMLOListElement,
  ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "tw-flex tw-items-center tw-gap-1.5 tw-text-sm tw-text-muted-foreground",
      className,
    )}
    {...props}
  />
));
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = forwardRef<
  HTMLLIElement,
  ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-item=""
    className={cn("tw-flex tw-shrink-0 tw-items-center", className)}
    {...props}
  />
));
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = forwardRef<
  HTMLAnchorElement,
  ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean;
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      ref={ref}
      className={cn("tw-transition-colors hover:tw-text-foreground", className)}
      {...props}
    />
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = forwardRef<
  HTMLSpanElement,
  ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("tw-font-normal tw-text-foreground", className)}
    {...props}
  />
));
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    data-separator=""
    className={cn("[&>svg]:tw-h-3.5 [&>svg]:tw-w-3.5", className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = ({
  className,
  ...props
}: ComponentPropsWithoutRef<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn(
      "tw-flex tw-h-9 tw-w-9 tw-items-center tw-justify-center",
      className,
    )}
    {...props}
  >
    <MoreHorizontal className="tw-h-4 tw-w-4" />
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
