import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Theme } from "@/data/plugins/themes/theme-registry.types";
import ThemeActionButton from "@/features/options-page/dashboard/pages/themes/components/ThemeCard/ActionButton";
import {
  ColorSchemeBadge,
  CompatibilityBadge,
} from "@/features/options-page/dashboard/pages/themes/components/ThemeCard/Badges";
import ThemeCardBanner from "@/features/options-page/dashboard/pages/themes/components/ThemeCard/Banner";
import ThemeCardEditButton from "@/features/options-page/dashboard/pages/themes/components/ThemeCard/EditButton";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

type ThemeCardProps = {
  theme?: Theme;
  type: "local" | "built-in";
};

export default function ThemeCard({ theme, type }: ThemeCardProps) {
  const { settings } = useExtensionLocalStorage();

  const isChosenTheme = settings?.theme === theme?.id;

  if (!theme) return null;

  return (
    <Card
      className={cn(
        "tw-group tw-relative tw-flex tw-flex-col tw-overflow-hidden tw-border-border/50 tw-bg-secondary tw-transition-all",
        { "tw-border-primary tw-bg-primary/10": isChosenTheme },
      )}
    >
      <div className="tw-relative tw-aspect-[16/9] tw-overflow-hidden">
        <ThemeCardBanner theme={theme} />
      </div>

      <CardHeader className="tw-space-y-0">
        <CardTitle className="tw-text-lg">{theme.title}</CardTitle>
        <CardDescription>{theme.description}</CardDescription>
      </CardHeader>

      <CardContent className="tw-grow">
        <div className="tw-flex tw-flex-wrap tw-gap-2">
          {theme.colorScheme?.includes("light") && (
            <ColorSchemeBadge type="light" />
          )}
          {theme.colorScheme?.includes("dark") && (
            <ColorSchemeBadge type="dark" />
          )}
          {theme.compatibleWith?.includes("desktop") && (
            <CompatibilityBadge type="desktop" />
          )}
          {theme.compatibleWith?.includes("mobile") && (
            <CompatibilityBadge type="mobile" />
          )}
        </div>
      </CardContent>

      <CardFooter className="tw-flex tw-flex-row tw-justify-end tw-gap-2">
        {type === "local" && <ThemeCardEditButton theme={theme} />}
        <ThemeActionButton theme={theme} />
      </CardFooter>
    </Card>
  );
}
