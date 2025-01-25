import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Theme } from "@/data/plugins/themes/theme-registry.types";
import ThemeActionButton from "@/entrypoints/options-page/dashboard/pages/themes/components/ThemeCard/ActionButton";
import {
  ColorSchemeBadge,
  CompatibilityBadge,
} from "@/entrypoints/options-page/dashboard/pages/themes/components/ThemeCard/Badges";
import ThemeCardBanner from "@/entrypoints/options-page/dashboard/pages/themes/components/ThemeCard/Banner";
import ThemeCardEditButton from "@/entrypoints/options-page/dashboard/pages/themes/components/ThemeCard/EditButton";
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
        "x-group x-relative x-flex x-flex-col x-overflow-hidden x-border-border/50 x-bg-secondary x-transition-all",
        { "x-border-primary x-bg-primary/10": isChosenTheme },
      )}
    >
      <div className="x-relative x-aspect-[16/9] x-overflow-hidden">
        <ThemeCardBanner theme={theme} />
      </div>

      <CardHeader className="x-space-y-0">
        <CardTitle className="x-text-lg">{theme.title}</CardTitle>
        <CardDescription>{theme.description}</CardDescription>
      </CardHeader>

      <CardContent className="x-grow">
        <div className="x-flex x-flex-wrap x-gap-2">
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

      <CardFooter className="x-flex x-flex-row x-justify-end x-gap-2">
        {type === "local" && <ThemeCardEditButton theme={theme} />}
        <ThemeActionButton theme={theme} />
      </CardFooter>
    </Card>
  );
}
