import { useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { PLUGINS_METADATA } from "@/data/plugins-data/plugins-data";
import Page from "@/entrypoints/options-page/components/Page";
import PluginDetailsModal from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-details/PluginDetailsModal";
import PluginDetailsPage from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-details/PluginDetailsPage";
import PluginsPage from "@/entrypoints/options-page/dashboard/pages/plugins/PluginsPage";
import useClearLocationState from "@/hooks/useClearLocationState";
import { UserGroup } from "@/services/cplx-api/feature-flags/cplx-feature-flags.types";
import useCplxFeatureFlags from "@/services/cplx-api/feature-flags/useCplxFeatureFlags";
import {
  isPluginId,
  PluginId,
} from "@/services/extension-local-storage/plugins.types";

export default function PluginDetailsWrapper() {
  useClearLocationState();
  const navigate = useNavigate();
  const { pluginId: pluginRouteSegment } = useParams();
  const location = useLocation();
  const { data: featureFlags } = useCplxFeatureFlags();
  const userGroup: UserGroup = "anon";

  const plugin = useMemo(
    () =>
      Object.values(PLUGINS_METADATA).find(
        (p) => p.routeSegment === pluginRouteSegment,
      ),
    [pluginRouteSegment],
  );

  useNavigateAwayOnInvalidRoute({ pluginId: plugin?.id });

  const isFromPluginList = location.state?.fromPluginList === true;

  if (!plugin || !isPluginId(plugin.id)) {
    return null;
  }

  if (featureFlags?.[userGroup]?.forceDisable.includes(plugin.id)) {
    return <PluginUnavailable onBackClick={() => navigate("/plugins")} />;
  }

  return (
    <>
      {isFromPluginList ? (
        <>
          <PluginsPage />
          <PluginDetailsModal pluginId={plugin.id} />
        </>
      ) : (
        <Page title={plugin.title}>
          <PluginDetailsPage pluginRouteSegment={pluginRouteSegment!} />
        </Page>
      )}
    </>
  );
}

function useNavigateAwayOnInvalidRoute({ pluginId }: { pluginId?: PluginId }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!pluginId) {
      navigate("/plugins", { replace: true });
    }
  }, [pluginId, navigate]);
}

function PluginUnavailable({ onBackClick }: { onBackClick: () => void }) {
  return (
    <div className="x-flex x-h-full x-min-h-[500px] x-flex-col x-items-center x-justify-center x-gap-4 x-text-center md:x-text-left">
      This plugin is not available at the moment. Please check back later.
      <Button onClick={onBackClick}>Back to dashboard</Button>
    </div>
  );
}
