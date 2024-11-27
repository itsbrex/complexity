import { SVG_FEATURED_BANNERS } from "@/data/consts/plugins/themes/svg-featured-banners";
import { BuiltInThemeId } from "@/data/consts/plugins/themes/theme-registry";
import { Theme } from "@/data/consts/plugins/themes/theme-registry.types";

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
        alt={theme.label}
        className="tw-size-full tw-object-cover"
      />
    );
  }

  const svgBanner = SVG_FEATURED_BANNERS[theme.id as BuiltInThemeId];
  if (svgBanner != null) {
    return <div className="tw-h-full tw-w-full">{svgBanner}</div>;
  }

  return null;
}
