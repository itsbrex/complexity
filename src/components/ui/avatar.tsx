import * as ArkAvatar from "@ark-ui/react";

const Avatar = ({ className, ...props }: ArkAvatar.AvatarRootProps) => (
  <ArkAvatar.AvatarRoot
    className={cn(
      "tw-relative tw-flex tw-h-10 tw-w-10 tw-shrink-0 tw-overflow-hidden tw-rounded-full",
      className,
    )}
    {...props}
  />
);

Avatar.displayName = "Avatar";

const AvatarImage = ({ className, ...props }: ArkAvatar.AvatarImageProps) => (
  <ArkAvatar.AvatarImage
    className={cn("tw-aspect-square tw-h-full tw-w-full", className)}
    {...props}
  />
);
AvatarImage.displayName = ArkAvatar.AvatarImage.displayName;

const AvatarFallback = ({
  className,
  ...props
}: ArkAvatar.AvatarFallbackProps) => (
  <ArkAvatar.AvatarFallback
    className={cn(
      "tw-flex tw-h-full tw-w-full tw-items-center tw-justify-center tw-rounded-full tw-bg-muted",
      className,
    )}
    {...props}
  />
);
AvatarFallback.displayName = ArkAvatar.AvatarFallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
