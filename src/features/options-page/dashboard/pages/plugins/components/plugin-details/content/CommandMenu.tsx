import KeyCombo from "@/components/KeyCombo";
import { Switch } from "@/components/ui/switch";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function CommandMenuPluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();

  if (!settings) return null;

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <div>
        Similar to Mac&apos;s Spotlight / Windows&apos;s PowerToys Run, but
        inside Perplexity.
      </div>
      <div>
        Activation hotkey: <KeyCombo keys={["Ctrl", "K"]} />
      </div>
      <Switch
        textLabel="Enable"
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
