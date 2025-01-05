import { useHotkeyRecorder } from "@/components/HotkeyRecorder";
import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function CommandMenuPluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();
  const defaultKeys = settings?.plugins["commandMenu"].hotkey ?? [];

  const { HotkeyRecorderUI } = useHotkeyRecorder({
    defaultKeys,
    onSave: (keys) => {
      mutation.mutate((draft) => {
        draft.plugins["commandMenu"].hotkey = keys;
      });
    },
  });

  if (!settings) return null;

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <div>
        Similar to Mac&apos;s Spotlight / Windows&apos;s PowerToys Run, but
        inside Perplexity.
      </div>
      <div className="tw-flex tw-flex-col tw-gap-2">
        <div>Activation hotkey:</div>
        <HotkeyRecorderUI />
      </div>
      <div className="tw-text-sm tw-text-muted-foreground">
        Side note: Thread search is subject to rate limiting by Perplexity at
        any time.
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
      <div className="tw-mx-auto tw-w-full tw-max-w-[700px]">
        <Image
          src="https://i.imgur.com/m8x0hm1.png"
          alt="command-menu"
          className="tw-w-full"
        />
      </div>
    </div>
  );
}
