import * as AvatarPrimitive from "@ark-ui/react";
import {
  forwardRef,
  type ElementRef,
  type ComponentPropsWithoutRef,
} from "react";

const Avatar = forwardRef<
  ElementRef<typeof AvatarPrimitive.AvatarRoot>,
  AvatarPrimitive.AvatarRootProps
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.AvatarRoot
    ref={ref}
    className={cn(
      "tw-relative tw-flex tw-h-10 tw-w-10 tw-shrink-0 tw-overflow-hidden tw-rounded-full",
      className,
    )}
    {...props}
  />
));

Avatar.displayName = "Avatar";

const AvatarImage = forwardRef<
  ElementRef<typeof AvatarPrimitive.AvatarImage>,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.AvatarImage>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.AvatarImage
    ref={ref}
    className={cn("tw-aspect-square tw-h-full tw-w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.AvatarImage.displayName;

const AvatarFallback = forwardRef<
  ElementRef<typeof AvatarPrimitive.AvatarFallback>,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.AvatarFallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.AvatarFallback
    ref={ref}
    className={cn(
      "tw-flex tw-h-full tw-w-full tw-items-center tw-justify-center tw-rounded-full tw-bg-muted",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.AvatarFallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
