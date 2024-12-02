import KeyCombo from "@/components/KeyCombo";
import { Switch } from "@/components/ui/switch";
import { P } from "@/components/ui/typography";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function NoFileCreationOnPastePluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();

  if (!settings) return null;

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <P>
        {t(
          "dashboard-plugins-page:pluginDetails.noFileCreationOnPaste.description",
        )}{" "}
        <KeyCombo keys={["Ctrl", "Shift", "V"]} />.
      </P>
      <Switch
        textLabel={t("action.enable")}
        checked={
          settings?.plugins["queryBox:noFileCreationOnPaste"].enabled ?? false
        }
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["queryBox:noFileCreationOnPaste"].enabled = checked;
          });
        }}
      />
    </div>
  );
}
