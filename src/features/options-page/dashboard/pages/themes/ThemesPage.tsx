import { LuPlus } from "react-icons/lu";
import { useRoutes } from "react-router-dom";

import { THEME_REGISTRY } from "@/data/consts/plugins/themes/theme-registry";
import { ThemeSections } from "@/features/options-page/dashboard/pages/themes/components/ThemeSections";

function ThemesListing() {
  const themes = Object.values(THEME_REGISTRY);
  const builtInThemes = themes.filter((theme) => theme.isBuiltIn);
  const communityThemes = themes.filter((theme) => !theme.isBuiltIn);

  return (
    <div>
      <div className="tw-mb-8">
        <h1 className="tw-mb-2 tw-text-2xl tw-font-bold">Custom Themes</h1>
        <p className="tw-text-muted-foreground">
          Customize your Perplexity interface with curated themes
        </p>
      </div>

      <div className="tw-mb-8 tw-flex tw-justify-center md:tw-justify-start">
        <div className="tw-group tw-relative tw-flex tw-w-[300px] tw-cursor-pointer tw-flex-col tw-items-center tw-justify-center tw-gap-6 tw-overflow-hidden tw-rounded-xl tw-border tw-border-border/50 tw-py-8 tw-transition-all hover:tw-border-primary/50">
          <div className="tw-rounded-full tw-border tw-border-border/50 tw-p-4 tw-transition-colors group-hover:tw-border-primary/50">
            <LuPlus className="tw-h-6 tw-w-6 tw-text-muted-foreground tw-transition-colors group-hover:tw-text-primary" />
          </div>
          <p className="tw-transform tw-text-sm tw-text-muted-foreground tw-transition-all tw-duration-300 group-hover:-tw-translate-y-2 group-hover:tw-text-primary">
            Create Custom Theme
          </p>
          <div className="tw-absolute tw-bottom-4 tw-text-sm tw-text-muted-foreground tw-opacity-0 tw-transition-opacity tw-duration-300 group-hover:tw-opacity-100">
            Soon
          </div>
        </div>
      </div>

      <ThemeSections
        builtInThemes={builtInThemes}
        communityThemes={communityThemes}
      />
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
