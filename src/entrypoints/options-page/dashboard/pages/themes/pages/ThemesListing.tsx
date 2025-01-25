import { LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

import { APP_CONFIG } from "@/app.config";
import { Button } from "@/components/ui/button";
import { BUILTIN_THEME_REGISTRY } from "@/data/plugins/themes/theme-registry";
import PreloadThemeSwitch from "@/entrypoints/options-page/dashboard/pages/themes/components/PreloadThemeSwitch";
import { ThemeSections } from "@/entrypoints/options-page/dashboard/pages/themes/components/ThemeSections";
import { useLocalThemes } from "@/services/indexed-db/themes/useLocalThemes";

export default function ThemesListing() {
  const navigate = useNavigate();

  const builtInThemes = useMemo(() => BUILTIN_THEME_REGISTRY, []);

  const { data: localThemes } = useLocalThemes();

  return (
    <div className="x-space-y-6">
      <div className="x-flex x-flex-wrap x-items-center x-justify-between x-gap-4">
        <div>
          <h1 className="x-mb-2 x-text-2xl x-font-bold">Custom Themes</h1>
          <p className="x-text-muted-foreground">
            Customize your Perplexity interface with curated themes
          </p>
        </div>
        <Button
          className="x-mx-auto md:x-mx-0 md:x-mt-auto"
          onClick={() => navigate("new")}
        >
          <LuPlus className="x-mr-2 x-size-5" />
          Create New Theme
        </Button>
      </div>

      {APP_CONFIG.BROWSER === "chrome" && <PreloadThemeSwitch />}

      <ThemeSections
        localThemes={localThemes ?? []}
        builtInThemes={builtInThemes}
      />
    </div>
  );
}
