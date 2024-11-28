import Cplx from "@/components/icons/Cplx";
import { BuiltInThemeId } from "@/data/consts/plugins/themes/theme-registry";

const THEME_COLORS: Record<BuiltInThemeId, string> = {
  complexity: "oklch(74.37% 0.1304 255.6)",
  "complexity-perplexity": "oklch(71.56% 0.1183 209.17)",
  "complexity-shy-moment": "oklch(73.59% 0.1411 285.6)",
  "complexity-sour-lemon": "oklch(93.86% 0.0876 92.74)",
};

function ThemeBanner({ color }: { color: string }) {
  return (
    <div className="tw-bg-[oklch(180_2%_10%)] tw-relative tw-flex tw-size-full tw-items-center tw-justify-center">
      <div
        className="tw-absolute tw-size-[40vw] tw-rounded-full tw-blur-2xl md:tw-size-[10vw] xl:tw-size-[7.3vw]"
        style={{
          backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)`,
        }}
      />
      <Cplx
        className="tw-relative tw-size-[40vw] md:tw-size-[10vw] xl:tw-size-[7.3vw]"
        primary={color}
        secondary="oklch(93.34% 0.0025 106.45)"
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
