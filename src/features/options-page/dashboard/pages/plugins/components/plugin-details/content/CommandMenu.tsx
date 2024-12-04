import KeyCombo from "@/components/KeyCombo";
import { Switch } from "@/components/ui/switch";
import usePlatformDetection from "@/hooks/usePlatformDetection";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function CommandMenuPluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();

  const isMac = usePlatformDetection() === "mac";

  if (!settings) return null;

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <div>
        {t("dashboard-plugins-page:pluginDetails.commandMenu.description")}
      </div>
      <div>
        {t("dashboard-plugins-page:pluginDetails.commandMenu.activationHotkey")}{" "}
        <KeyCombo keys={[Key.Control, isMac ? "I" : "K"]} />
      </div>
      <div className="tw-text-sm tw-text-muted-foreground">
        {t("dashboard-plugins-page:pluginDetails.commandMenu.sideNote")}
      </div>
      <Switch
        textLabel={t("action.enable")}
        checked={settings?.plugins["commandMenu"].enabled ?? false}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["commandMenu"].enabled = checked;
          });
        }}
      />
    </div>
  );
}
