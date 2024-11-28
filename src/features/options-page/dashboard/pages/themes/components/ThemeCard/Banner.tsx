import {
  SVG_FEATURED_BANNERS,
  ThemeBanner,
} from "@/data/plugins/themes/svg-featured-banners";
import { BuiltInThemeId } from "@/data/plugins/themes/theme-registry";
import { Theme } from "@/data/plugins/themes/theme-registry.types";
import { hexToOklchString } from "@/features/options-page/dashboard/pages/themes/pages/utils";

type ThemeCardBannerProps = {
  theme: Theme;
};

export default function ThemeCardBanner({ theme }: ThemeCardBannerProps) {
  return (
    <div className="tw-size-full tw-transition-transform tw-duration-500 group-hover:tw-scale-110">
      <BannerContent theme={theme} />
    </div>
  );
}

function BannerContent({ theme }: { theme: Theme }) {
  if (theme.featuredImage) {
    return (
      <img
        src={theme.featuredImage}
        alt={theme.title}
        className="tw-size-full tw-object-cover"
      />
    );
  }

  const svgBanner = SVG_FEATURED_BANNERS[theme.id as BuiltInThemeId];

  if (svgBanner != null) {
    return <div className="tw-h-full tw-w-full">{svgBanner}</div>;
  }

  return (
    <ThemeBanner
      color={
        theme.config?.accentColor
          ? `oklch(${hexToOklchString(theme.config.accentColor)})`
          : undefined
      }
    />
  );
}
