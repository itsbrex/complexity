import { Switch } from "@/components/ui/switch";
import { Plugins } from "@/services/extension-local-storage/plugins.types";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

type PluginKey = keyof Plugins["thread:betterMessageToolbars"];

export default function BetterThreadMessageToolbarsPluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();

  const handleCheckedChange = useCallback(
    (key: PluginKey) =>
      ({ checked }: { checked: boolean }) =>
        mutation.mutate((draft) => {
          draft.plugins["thread:betterMessageToolbars"][key] = checked;
        }),
    [mutation],
  );

  const renderSwitch = useCallback(
    (key: PluginKey) => (
      <div>
        <Switch
          className="tw-items-start"
          textLabel={
            <div>
              <div>
                {t(
                  `dashboard-plugins-page:pluginDetails.betterThreadMessageToolbars.options.${key}.label`,
                )}
              </div>
              <div className="tw-text-sm tw-text-muted-foreground">
                {t(
                  `dashboard-plugins-page:pluginDetails.betterThreadMessageToolbars.options.${key}.description`,
                )}
              </div>
            </div>
          }
          checked={settings?.plugins["thread:betterMessageToolbars"][key]}
          onCheckedChange={handleCheckedChange(key)}
        />
      </div>
    ),
    [settings, handleCheckedChange],
  );

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <div className="tw-flex tw-flex-col tw-gap-2">
        {t(
          "dashboard-plugins-page:pluginDetails.betterThreadMessageToolbars.description",
        )}
      </div>
      <Switch
        textLabel={t("action.enable")}
        checked={settings?.plugins["thread:betterMessageToolbars"].enabled}
        onCheckedChange={handleCheckedChange("enabled")}
      />
      {settings?.plugins["thread:betterMessageToolbars"].enabled && (
        <div className="tw-flex tw-flex-col tw-gap-2">
          <div className="tw-text-sm tw-text-muted-foreground">
            {t("action.options")}
          </div>
          {renderSwitch("sticky")}
          {renderSwitch("simplifyRewriteDropdown")}
          {renderSwitch("hideUnnecessaryButtons")}
          {renderSwitch("explicitModelName")}
        </div>
      )}
    </div>
  );
}
