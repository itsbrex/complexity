import { Switch } from "@/components/ui/switch";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function SubmitOnCtrlEnterPluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();
  const pluginSettings = settings?.plugins["queryBox:submitOnCtrlEnter"];

  if (!settings) return null;

  return (
    <div className="tw-flex tw-max-w-lg tw-flex-col tw-gap-4">
      <Switch
        textLabel="Enable"
        checked={pluginSettings?.enabled ?? false}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["queryBox:submitOnCtrlEnter"].enabled = checked;
          });
        }}
      />

      <div className="tw-mx-auto tw-w-full tw-max-w-[700px]">
        <video
          autoPlay
          loop
          muted
          playsInline
          controls
          src="https://cdn.cplx.app/assets/submit-on-ctrl-enter.mp4"
          className="tw-w-full"
        />
      </div>
    </div>
  );
}
