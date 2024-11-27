import { Theme } from "@/data/consts/plugins/themes/theme-registry.types";
import ThemeActionButton from "@/features/options-page/dashboard/pages/themes/components/ThemeCard/ActionButton";
import {
  ColorSchemeBadge,
  CompatibilityBadge,
  OfficialBadge,
} from "@/features/options-page/dashboard/pages/themes/components/ThemeCard/Badges";
import ThemeCardBanner from "@/features/options-page/dashboard/pages/themes/components/ThemeCard/Banner";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

type ThemeCardProps = {
  theme?: Theme;
};

export default function ThemeCard({ theme }: ThemeCardProps) {
  const { settings } = useExtensionLocalStorage();

  const isChosenTheme = settings?.theme === theme?.id;

  if (!theme) return null;

  return (
    <div
      className={cn(
        "tw-group tw-relative tw-flex tw-flex-col tw-overflow-hidden tw-rounded-xl tw-border tw-border-border/50 tw-transition-all",
        { "tw-border-primary tw-bg-primary/10": isChosenTheme },
      )}
    >
      <div className="tw-relative tw-aspect-[16/9] tw-overflow-hidden">
        <ThemeCardBanner theme={theme} />
      </div>

      <div className="tw-flex tw-grow tw-flex-col tw-items-start tw-justify-between tw-gap-4 tw-p-4">
        <div>
          <div className="tw-mb-1 tw-text-lg tw-font-semibold">
            {theme.label}
          </div>
          <div className="tw-mb-3 tw-text-sm tw-text-muted-foreground">
            {theme.description}
          </div>
          <div className="tw-flex tw-flex-wrap tw-gap-2">
            {theme.isBuiltIn && <OfficialBadge />}
            {theme.colorScheme.includes("light") && (
              <ColorSchemeBadge type="light" />
            )}
            {theme.colorScheme.includes("dark") && (
              <ColorSchemeBadge type="dark" />
            )}
            {theme.compatibleWith.includes("desktop") && (
              <CompatibilityBadge type="desktop" />
            )}
            {theme.compatibleWith.includes("mobile") && (
              <CompatibilityBadge type="mobile" />
            )}
          </div>
        </div>
        <div className="tw-ml-auto">
          <ThemeActionButton theme={theme} />
        </div>
      </div>
    </div>
  );
}
