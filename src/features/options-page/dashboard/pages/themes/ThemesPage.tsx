import { LuPlus } from "react-icons/lu";
import { useRoutes } from "react-router-dom";

import { THEME_REGISTRY } from "@/data/consts/plugins/themes/theme-registry";
import ThemeCard from "@/features/options-page/dashboard/pages/themes/components/ThemeCard";

function ThemesListing() {
  return (
    <div>
      <div className="tw-mb-8">
        <h1 className="tw-mb-2 tw-text-2xl tw-font-bold">Custom Themes</h1>
        <p className="tw-text-muted-foreground">
          Customize your Perplexity interface with curated themes
        </p>
      </div>

      <div className="tw-grid tw-grid-cols-1 tw-gap-4 md:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-4">
        <div className="tw-group tw-relative tw-flex tw-h-full tw-min-h-[250px] tw-cursor-pointer tw-flex-col tw-items-center tw-justify-center tw-gap-4 tw-overflow-hidden tw-rounded-xl tw-border tw-border-border/50 tw-transition-all hover:tw-border-primary/50">
          <div className="tw-rounded-full tw-border tw-border-border/50 tw-p-4 tw-transition-colors group-hover:tw-border-primary/50">
            <LuPlus className="tw-h-6 tw-w-6 tw-text-muted-foreground tw-transition-colors group-hover:tw-text-primary" />
          </div>
          <p className="tw-text-sm tw-text-muted-foreground tw-transition-colors group-hover:tw-text-primary">
            Create Custom Theme
          </p>
          <div className="tw-hidden tw-text-sm tw-text-muted-foreground group-hover:tw-block">
            Soon
          </div>
        </div>
        {Object.values(THEME_REGISTRY).map((theme) => (
          <ThemeCard key={theme.id} theme={theme} />
        ))}
      </div>
    </div>
  );
}

export default function ThemesPage() {
  return useRoutes([
    {
      path: "*",
      element: <ThemesListing />,
    },
  ]);
}
