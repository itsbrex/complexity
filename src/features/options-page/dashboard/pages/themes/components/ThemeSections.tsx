import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { H2 } from "@/components/ui/typography";
import { Theme } from "@/data/consts/plugins/themes/theme-registry.types";
import ThemeCard from "@/features/options-page/dashboard/pages/themes/components/ThemeCard/ThemeCard";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";

type ThemeSectionsProps = {
  builtInThemes: Theme[];
  communityThemes: Theme[];
};

export function ThemeSections({
  builtInThemes,
  communityThemes,
}: ThemeSectionsProps) {
  const { isMobile } = useIsMobileStore();

  if (builtInThemes.length === 0 && communityThemes.length === 0) {
    return <div>No themes found</div>;
  }

  return isMobile ? (
    <MobileThemeSections
      builtInThemes={builtInThemes}
      communityThemes={communityThemes}
    />
  ) : (
    <DesktopThemeSections
      builtInThemes={builtInThemes}
      communityThemes={communityThemes}
    />
  );
}

function ThemesGrid({ themes }: { themes: Theme[] }) {
  return (
    <div className="tw-grid tw-grid-cols-1 tw-gap-4 md:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-4">
      {themes.map((theme) => (
        <ThemeCard key={theme.id} theme={theme} />
      ))}
    </div>
  );
}

function MobileThemeSections({
  builtInThemes,
  communityThemes,
}: ThemeSectionsProps) {
  return (
    <Tabs defaultValue="built-in">
      <TabsList className="tw-w-full">
        {builtInThemes.length > 0 && (
          <TabsTrigger value="built-in">Built-in Themes</TabsTrigger>
        )}
        <TabsTrigger value="all">All Themes</TabsTrigger>
      </TabsList>

      {builtInThemes.length > 0 && (
        <TabsContent value="built-in" className="tw-mt-4">
          <ThemesGrid themes={builtInThemes} />
        </TabsContent>
      )}

      <TabsContent value="all" className="tw-mt-4">
        <ThemesGrid themes={communityThemes} />
      </TabsContent>
    </Tabs>
  );
}

function DesktopThemeSections({
  builtInThemes,
  communityThemes,
}: ThemeSectionsProps) {
  return (
    <div className="tw-flex tw-flex-col tw-gap-8">
      {builtInThemes.length > 0 && (
        <section>
          <H2 className="tw-mb-4 !tw-text-lg tw-font-semibold">
            Built-in Themes
          </H2>
          <ThemesGrid themes={builtInThemes} />
        </section>
      )}

      {communityThemes.length > 0 && (
        <section>
          <H2 className="tw-mb-4 !tw-text-lg tw-font-semibold">
            Community Themes
          </H2>
          <ThemesGrid themes={communityThemes} />
        </section>
      )}
    </div>
  );
}
