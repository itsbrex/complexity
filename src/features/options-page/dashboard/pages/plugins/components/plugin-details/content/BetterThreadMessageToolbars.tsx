import { Switch } from "@/components/ui/switch";
import { Plugins } from "@/services/extension-local-storage/plugins.types";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

type PluginKey = keyof Plugins["thread:betterMessageToolbars"];

type SwitchOption = {
  label: string;
  description: string;
};

const SWITCH_OPTIONS: Record<Exclude<PluginKey, "enabled">, SwitchOption> = {
  sticky: {
    label: "Stick to top",
    description:
      "Always keep the toolbar visible at the top of the page when scrolling.",
  },
  simplifyRewriteDropdown: {
    label: "Simplify Rewrite Dropdown Menu",
    description: "Hide model's description (only for desktop).",
  },
  hideUnnecessaryButtons: {
    label: "Hide Unnecessary Buttons",
    description: "Hide Share, Thumbs Up/Down buttons.",
  },
  explicitModelName: {
    label: "Explicit Model Name",
    description: "Show the model name without hovering.",
  },
};

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
    (key: Exclude<PluginKey, "enabled">) => (
      <div>
        <Switch
          className="tw-items-start"
          textLabel={
            <div>
              <div>{SWITCH_OPTIONS[key].label}</div>
              <div className="tw-text-sm tw-text-muted-foreground">
                {SWITCH_OPTIONS[key].description}
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
          {Object.keys(SWITCH_OPTIONS).map((key) =>
            renderSwitch(key as Exclude<PluginKey, "enabled">),
          )}
        </div>
      )}
    </div>
  );
}
