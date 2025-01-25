import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { H2 } from "@/components/ui/typography";
import NoPluginsFound from "@/entrypoints/options-page/dashboard/pages/plugins/components/NoPluginsFound";
import { PluginsGrid } from "@/entrypoints/options-page/dashboard/pages/plugins/components/PluginsGrid";
import PluginsEnableSet from "@/entrypoints/options-page/dashboard/pages/plugins/PluginsEnableSet";
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
    <div className="x-flex x-flex-col">
      <PluginsEnableSet />
      <Tabs defaultValue="all">
        <TabsList className="x-w-full">
          {favoritePluginIds.length > 0 && (
            <TabsTrigger value="favorites">Favourite Plugins</TabsTrigger>
          )}
          <TabsTrigger value="all">All Plugins</TabsTrigger>
        </TabsList>
        {favoritePluginIds.length > 0 && (
          <TabsContent value="favorites" className="x-mt-4">
            <PluginsGrid pluginIds={favoritePluginIds} />
          </TabsContent>
        )}
        <TabsContent value="all" className="x-mt-4">
          <PluginsGrid pluginIds={otherPluginIds} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DesktopPluginSections({
  favoritePluginIds,
  otherPluginIds,
}: PluginSectionsProps) {
  return (
    <div className="x-flex x-flex-col x-gap-8">
      {favoritePluginIds.length > 0 && (
        <section>
          <H2 className="x-mb-4 !x-text-lg x-font-semibold">
            Favourite Plugins
          </H2>
          <PluginsGrid pluginIds={favoritePluginIds} />
        </section>
      )}

      {otherPluginIds.length > 0 && (
        <section>
          <div className="x-flex x-items-center x-justify-between x-gap-4">
            <H2 className="x-mb-4 !x-text-lg x-font-semibold">All Plugins</H2>
            <PluginsEnableSet />
          </div>
          <PluginsGrid pluginIds={otherPluginIds} />
        </section>
      )}
    </div>
  );
}
