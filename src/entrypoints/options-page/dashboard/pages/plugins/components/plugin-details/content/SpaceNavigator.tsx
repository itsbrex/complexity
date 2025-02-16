import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function SpaceNavigatorPluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();
  const pluginSettings = settings?.plugins["spaceNavigator"];

  if (!settings) return null;

  return (
    <div className="x-flex x-max-w-lg x-flex-col x-gap-4">
      <div className="x-text-sm x-text-muted-foreground">
        Save time finding & navigating to your Spaces.
      </div>
      <Switch
        textLabel="Enable"
        checked={pluginSettings?.enabled ?? false}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["spaceNavigator"].enabled = checked;
          });
        }}
      />

      <div className="x-mx-auto x-w-full x-max-w-[700px]">
        <Image
          src="https://i.imgur.com/r0Y1atO.png"
          alt="space-navigator"
          className="x-w-full"
        />
      </div>
    </div>
  );
}
