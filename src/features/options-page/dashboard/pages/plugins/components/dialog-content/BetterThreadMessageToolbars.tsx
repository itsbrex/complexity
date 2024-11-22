import { Switch } from "@/components/ui/switch";
import { Plugins } from "@/services/extension-local-storage/plugins.types";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

type PluginKey = keyof Plugins["thread:betterMessageToolbars"];

export default function BetterThreadMessageToolbarsDialogContent() {
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
    (label: string, description: string, key: PluginKey) => (
      <div>
        <Switch
          className="tw-items-start"
          textLabel={
            <div>
              <div>{label}</div>
              <div className="tw-text-sm tw-text-muted-foreground">
                {description}
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
        Useful tweaks to make the toolbar more compact and easier to use.
      </div>
      <Switch
        textLabel="Enable"
        checked={settings?.plugins["thread:betterMessageToolbars"].enabled}
        onCheckedChange={handleCheckedChange("enabled")}
      />
      {settings?.plugins["thread:betterMessageToolbars"].enabled && (
        <div className="tw-flex tw-flex-col tw-gap-2">
          <div className="tw-text-sm tw-text-muted-foreground">Options</div>
          {renderSwitch(
            "Stick to top",
            "Always keep the toolbar visible at the top of the page when scrolling.",
            "sticky",
          )}
          {renderSwitch(
            "Simplify Rewrite Dropdown Menu",
            "Hide model's description (only for desktop).",
            "simplifyRewriteDropdown",
          )}
          {renderSwitch(
            "Hide Unnecessary Buttons",
            "Hide Share, Thumbs Up/Down buttons.",
            "hideUnnecessaryButtons",
          )}
          {renderSwitch(
            "Explicit Model Name",
            "Show the model name without hovering.",
            "explicitModelName",
          )}
        </div>
      )}
    </div>
  );
}
