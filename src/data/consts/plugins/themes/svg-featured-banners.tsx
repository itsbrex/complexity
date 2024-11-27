import Cplx from "@/components/icons/Cplx";
import { BuiltInThemeId } from "@/data/consts/plugins/themes/theme-registry";

const THEME_COLORS: Record<BuiltInThemeId, string> = {
  complexity: "hsl(214 97% 72%)",
  "complexity-perplexity": "hsl(187 73% 46%)",
  "complexity-shy-moment": "hsl(244 98% 80%)",
  "complexity-sour-lemon": "hsl(46 100% 83%)",
};

function ThemeBanner({ color }: { color: string }) {
  return (
    <div className="tw-bg-[hsl(180_2%_10%)] tw-relative tw-flex tw-size-full tw-items-center tw-justify-center">
      <div
        className="tw-absolute tw-size-[40vw] tw-rounded-full tw-blur-2xl md:tw-size-[10vw] xl:tw-size-[7.3vw]"
        style={{
          backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)`,
        }}
      />
      <Cplx
        className="tw-relative tw-size-[40vw] md:tw-size-[10vw] xl:tw-size-[7.3vw]"
        primary={color}
        secondary="hsl(60 4% 91%)"
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
