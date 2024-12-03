import { LuSun, LuMoon, LuMonitor, LuSmartphone } from "react-icons/lu";

import { Badge } from "@/components/ui/badge";

export const ColorSchemeBadge = memo(({ type }: { type: "light" | "dark" }) => {
  const Icon = type === "light" ? LuSun : LuMoon;
  return (
    <Badge variant="secondary" className="tw-flex tw-items-center tw-gap-2">
      <Icon className="tw-size-3" />
      {t(
        `dashboard-themes-page:themesPage.themeCard.badges.colorScheme.${type}`,
      )}
    </Badge>
  );
});

export const CompatibilityBadge = memo(
  ({ type }: { type: "desktop" | "mobile" }) => {
    const Icon = type === "desktop" ? LuMonitor : LuSmartphone;
    return (
      <Badge variant="outline" className="tw-flex tw-items-center tw-gap-2">
        <Icon className="tw-size-3" />
        {t(
          `dashboard-themes-page:themesPage.themeCard.badges.compatibility.${type}`,
        )}
      </Badge>
    );
  },
);
