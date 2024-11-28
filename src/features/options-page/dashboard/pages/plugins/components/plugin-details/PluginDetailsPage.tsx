import { LuChevronLeft } from "react-icons/lu";
import { Link } from "react-router-dom";

import { PLUGINS_METADATA } from "@/data/plugins/plugins-data";
import { PLUGIN_DIALOG_CONTENT } from "@/features/options-page/dashboard/pages/plugins/dialog-content";

type PluginDetailsPageProps = {
  pluginRouteSegment: string;
};

export default function PluginDetailsPage({
  pluginRouteSegment,
}: PluginDetailsPageProps) {
  const plugin = Object.values(PLUGINS_METADATA).find(
    (plugin) => plugin.routeSegment === pluginRouteSegment,
  );

  const dialogContent = plugin ? PLUGIN_DIALOG_CONTENT[plugin.id] : null;

  if (!plugin) return null;

  return (
    <div className="tw-space-y-6">
      <Link
        to="/plugins"
        className="tw-mb-4 tw-flex tw-items-center tw-gap-2 tw-text-muted-foreground tw-transition hover:tw-text-foreground"
      >
        <LuChevronLeft />
        Back to plugins
      </Link>
      <div>
        <h1 className="tw-text-2xl tw-font-bold">{plugin.title}</h1>
        <p className="tw-mt-2 tw-text-muted-foreground">{plugin.description}</p>
      </div>
      {dialogContent}
    </div>
  );
}
