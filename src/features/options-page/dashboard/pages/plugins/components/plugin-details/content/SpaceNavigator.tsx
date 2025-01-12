import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function SpaceNavigatorPluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();
  const pluginSettings = settings?.plugins["queryBox:spaceNavigator"];

  if (!settings) return null;

  return (
    <div className="tw-flex tw-max-w-lg tw-flex-col tw-gap-4">
      <Switch
        textLabel="Enable"
        checked={pluginSettings?.enabled ?? false}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["queryBox:spaceNavigator"].enabled = checked;
          });
        }}
      />

      <div className="tw-mx-auto tw-w-full tw-max-w-[700px]">
        <Image
          src="https://i.imgur.com/r0Y1atO.png"
          alt="space-navigator"
          className="tw-w-full"
        />
      </div>
    </div>
  );
}
