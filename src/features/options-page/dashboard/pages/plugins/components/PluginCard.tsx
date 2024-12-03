import { GoKebabHorizontal, GoStar, GoStarFill } from "react-icons/go";
import { LuAlertTriangle } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

import Tooltip from "@/components/Tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Ul } from "@/components/ui/typography";
import { PLUGIN_TAGS, PLUGINS_METADATA } from "@/data/plugins/plugins-data";
import { PLUGIN_DETAILS } from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/plugins-details";
import useCplxFeatureFlags from "@/services/cplx-api/feature-flags/useCplxFeatureFlags";
import { PluginId } from "@/services/extension-local-storage/plugins.types";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

type PluginCardProps = {
  pluginId: PluginId;
};

export function PluginCard({ pluginId }: PluginCardProps) {
  const navigate = useNavigate();

  const { settings, mutation } = useExtensionLocalStorage();

  const { title, description, tags, routeSegment } = PLUGINS_METADATA[pluginId];

  const dialogContent = PLUGIN_DETAILS[pluginId];

  const { data: featureFlags } = useCplxFeatureFlags();

  const areAllDependentPluginsEnabled = useMemo(
    () =>
      PLUGINS_METADATA?.[pluginId]?.dependentPlugins?.every(
        (dependentPluginId) => settings?.plugins[dependentPluginId].enabled,
      ) ?? true,
    [pluginId, settings],
  );

  const areAnyDependentPluginsForceDisabled = useMemo(
    () =>
      PLUGINS_METADATA?.[pluginId]?.dependentPlugins?.some(
        (dependentPluginId) =>
          featureFlags?.anon?.forceDisable.includes(dependentPluginId),
      ) ?? false,
    [pluginId, featureFlags],
  );

  if (!settings) return null;

  return (
    <Card className="tw-flex tw-h-full tw-flex-col tw-bg-secondary">
      <CardHeader className="tw-flex tw-flex-row tw-items-start tw-justify-between tw-space-y-0">
        <div>
          <CardTitle>
            <span className="tw-text-lg">{title}</span>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      {tags != null && tags.length > 0 && (
        <CardContent>
          <div className="tw-flex tw-flex-wrap tw-gap-2">
            {tags.map((tag) => (
              <Tooltip key={tag} content={PLUGIN_TAGS[tag].description}>
                <Badge
                  variant="default"
                  className={cn({
                    "tw-bg-destructive tw-text-destructive-foreground hover:tw-bg-destructive/80":
                      tag === "experimental",
                  })}
                >
                  {PLUGIN_TAGS[tag].label.toLocaleUpperCase()}
                </Badge>
              </Tooltip>
            ))}
          </div>
        </CardContent>
      )}
      <CardFooter className="tw-mt-auto tw-flex tw-justify-between">
        <div className="tw-flex tw-gap-2">
          {dialogContent != null && (
            <Button
              onClick={() =>
                navigate(`/plugins/${routeSegment}`, {
                  state: {
                    fromPluginList: true,
                  },
                })
              }
            >
              Details
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <GoKebabHorizontal className="tw-size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                value="favorite"
                onClick={() => {
                  mutation.mutate((draft) => {
                    if (settings?.favoritePluginIds == null) return;

                    const currentState =
                      settings.favoritePluginIds.includes(pluginId);

                    if (currentState) {
                      draft.favoritePluginIds = draft.favoritePluginIds!.filter(
                        (id) => id !== pluginId,
                      );
                    } else {
                      draft.favoritePluginIds.push(pluginId);
                    }
                  });
                }}
              >
                <span className="tw-flex tw-items-center">
                  {settings?.favoritePluginIds?.includes(pluginId) ? (
                    <>
                      <GoStarFill className="tw-mr-2 tw-h-4 tw-w-4 tw-text-yellow-500" />
                      Remove from favorites
                    </>
                  ) : (
                    <>
                      <GoStar className="tw-mr-2 tw-h-4 tw-w-4" />
                      Add to favorites
                    </>
                  )}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {settings?.plugins[pluginId].enabled &&
          !areAllDependentPluginsEnabled && (
            <Tooltip
              content={
                <div>
                  <div>
                    One or more dependencies are disabled, please enable them to
                    use this plugin:
                  </div>
                  <Ul>
                    {PLUGINS_METADATA[pluginId]?.dependentPlugins?.map(
                      (dependentPluginId) => (
                        <li key={dependentPluginId}>
                          {PLUGINS_METADATA[dependentPluginId]?.title}
                        </li>
                      ),
                    )}
                  </Ul>
                </div>
              }
            >
              <LuAlertTriangle className="tw-size-4 tw-text-yellow-300 dark:tw-text-yellow-500" />
            </Tooltip>
          )}

        {areAnyDependentPluginsForceDisabled && (
          <Tooltip
            content={
              <div>
                This plugin is disabled because one or more of its dependencies
                are not available.
              </div>
            }
          >
            <LuAlertTriangle className="tw-size-4 tw-text-destructive" />
          </Tooltip>
        )}

        <Switch
          checked={settings?.plugins[pluginId].enabled ?? false}
          onCheckedChange={({ checked }) => {
            mutation.mutate((draft) => {
              draft.plugins[pluginId].enabled = checked;
            });
          }}
        />
      </CardFooter>
    </Card>
  );
}
