import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { H2 } from "@/components/ui/typography";
import NoPluginsFound from "@/features/options-page/dashboard/pages/plugins/components/NoPluginsFound";
import { PluginsGrid } from "@/features/options-page/dashboard/pages/plugins/components/PluginsGrid";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { PluginId } from "@/services/extension-local-storage/plugins.types";

type PluginSectionsProps = {
  favoritePluginIds: PluginId[];
  otherPluginIds: PluginId[];
};

export function PluginSections({
  favoritePluginIds,
  otherPluginIds,
}: PluginSectionsProps) {
  const { isMobile } = useIsMobileStore();

  if (favoritePluginIds.length === 0 && otherPluginIds.length === 0) {
    return <NoPluginsFound />;
  }

  return isMobile ? (
    <MobilePluginSections
      favoritePluginIds={favoritePluginIds}
      otherPluginIds={otherPluginIds}
    />
  ) : (
    <DesktopPluginSections
      favoritePluginIds={favoritePluginIds}
      otherPluginIds={otherPluginIds}
    />
  );
}

function MobilePluginSections({
  favoritePluginIds,
  otherPluginIds,
}: PluginSectionsProps) {
  return (
    <Tabs defaultValue="all">
      <TabsList className="tw-w-full">
        {favoritePluginIds.length > 0 && (
          <TabsTrigger value="favorites">
            {t("dashboard-plugins-page:pluginsPage.sections.favouritePlugins")}
          </TabsTrigger>
        )}
        <TabsTrigger value="all">
          {t("dashboard-plugins-page:pluginsPage.sections.allPlugins")}
        </TabsTrigger>
      </TabsList>

      {favoritePluginIds.length > 0 && (
        <TabsContent value="favorites" className="tw-mt-4">
          <PluginsGrid pluginIds={favoritePluginIds} />
        </TabsContent>
      )}

      <TabsContent value="all" className="tw-mt-4">
        <PluginsGrid pluginIds={otherPluginIds} />
      </TabsContent>
    </Tabs>
  );
}

function DesktopPluginSections({
  favoritePluginIds,
  otherPluginIds,
}: PluginSectionsProps) {
  return (
    <div className="tw-flex tw-flex-col tw-gap-8">
      {favoritePluginIds.length > 0 && (
        <section>
          <H2 className="tw-mb-4 !tw-text-lg tw-font-semibold">
            {t("dashboard-plugins-page:pluginsPage.sections.favouritePlugins")}
          </H2>
          <PluginsGrid pluginIds={favoritePluginIds} />
        </section>
      )}

      {otherPluginIds.length > 0 && (
        <section>
          <H2 className="tw-mb-4 !tw-text-lg tw-font-semibold">
            {t("dashboard-plugins-page:pluginsPage.sections.allPlugins")}
          </H2>
          <PluginsGrid pluginIds={otherPluginIds} />
        </section>
      )}
    </div>
  );
}
