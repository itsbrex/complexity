import Cplx from "@/components/icons/Cplx";
import { BuiltInThemeId } from "@/data/plugins/themes/theme-registry";

const THEME_COLORS: Record<BuiltInThemeId, string> = {
  complexity: "oklch(74.37% 0.1304 255.6)",
  "complexity-perplexity": "oklch(71.56% 0.1183 209.17)",
  "complexity-shy-moment": "oklch(73.59% 0.1411 285.6)",
  "complexity-sour-lemon": "oklch(93.86% 0.0876 92.74)",
};

export function ThemeBanner({ color }: { color?: string }) {
  const shouldGlow = color != null;

  if (!color) color = THEME_COLORS["complexity-perplexity"];

  return (
    <div className="tw-relative tw-flex tw-size-full tw-items-center tw-justify-center tw-bg-[oklch(21.67%_0.0016_197.04)]">
      {shouldGlow && (
        <div
          className="tw-absolute tw-size-[50%] tw-rounded-full tw-blur-2xl"
          style={{
            backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)`,
          }}
        />
      )}
      <Cplx
        className="tw-relative tw-size-[50%] tw-fill-[oklch(93.34%_0.0025_106.45)]"
        primary={color}
      />
    </div>
  );
}

export const SVG_FEATURED_BANNERS: Record<BuiltInThemeId, React.ReactNode> = {
  complexity: <ThemeBanner color={THEME_COLORS.complexity} />,
  "complexity-perplexity": (
    <ThemeBanner color={THEME_COLORS["complexity-perplexity"]} />
  ),
  "complexity-shy-moment": (
    <ThemeBanner color={THEME_COLORS["complexity-shy-moment"]} />
  ),
  "complexity-sour-lemon": (
    <ThemeBanner color={THEME_COLORS["complexity-sour-lemon"]} />
  ),
};
