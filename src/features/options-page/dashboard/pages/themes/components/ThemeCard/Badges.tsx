import {
  LuSun,
  LuMoon,
  LuMonitor,
  LuSmartphone,
  LuBadgeCheck,
} from "react-icons/lu";

import { Badge } from "@/components/ui/badge";

export const ColorSchemeBadge = memo(({ type }: { type: "light" | "dark" }) => {
  const Icon = type === "light" ? LuSun : LuMoon;
  return (
    <Badge variant="secondary" className="tw-flex tw-items-center tw-gap-2">
      <Icon className="tw-size-3" />
      {type === "light" ? "Light" : "Dark"}
    </Badge>
  );
});

export const CompatibilityBadge = memo(
  ({ type }: { type: "desktop" | "mobile" }) => {
    const Icon = type === "desktop" ? LuMonitor : LuSmartphone;
    return (
      <Badge variant="outline" className="tw-flex tw-items-center tw-gap-2">
        <Icon className="tw-size-3" />
        {type === "desktop" ? "Desktop" : "Mobile"}
      </Badge>
    );
  },
);

export const OfficialBadge = memo(() => {
  return (
    <Badge
      variant="secondary"
      className="tw-flex tw-items-center tw-gap-2 tw-bg-primary/10"
    >
      <LuBadgeCheck className="tw-size-3 tw-text-primary" />
      Official
    </Badge>
  );
});
