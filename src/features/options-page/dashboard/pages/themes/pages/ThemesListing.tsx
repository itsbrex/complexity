import { LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { BUILTIN_THEME_REGISTRY } from "@/data/plugins/themes/theme-registry";
import { ThemeSections } from "@/features/options-page/dashboard/pages/themes/components/ThemeSections";
import { useLocalThemes } from "@/services/indexed-db/themes/useLocalThemes";

export default function ThemesListing() {
  const navigate = useNavigate();

  const builtInThemes = useMemo(() => BUILTIN_THEME_REGISTRY, []);

  const { data: localThemes } = useLocalThemes();

  return (
    <div className="tw-space-y-6">
      <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-4">
        <div>
          <h1 className="tw-mb-2 tw-text-2xl tw-font-bold">Custom Themes</h1>
          <p className="tw-text-muted-foreground">
            Customize your Perplexity interface with curated themes
          </p>
        </div>
        <Button
          className="tw-mx-auto md:tw-mx-0 md:tw-mt-auto"
          onClick={() => navigate("new")}
        >
          <LuPlus className="tw-mr-2 tw-size-5" />
          Create New Theme
        </Button>
      </div>

      <ThemeSections
        localThemes={localThemes ?? []}
        builtInThemes={builtInThemes}
      />
    </div>
  );
}
