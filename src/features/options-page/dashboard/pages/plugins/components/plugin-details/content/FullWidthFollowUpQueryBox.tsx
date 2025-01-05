import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function FullWidthFollowUpQueryBoxPluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();
  const pluginSettings = settings?.plugins["queryBox:fullWidthFollowUp"];

  if (!settings) return null;

  return (
    <div className="tw-flex tw-max-w-lg tw-flex-col tw-gap-4">
      <Switch
        textLabel="Enable"
        checked={pluginSettings?.enabled ?? false}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["queryBox:fullWidthFollowUp"].enabled = checked;
          });
        }}
      />

      <div className="tw-mx-auto tw-w-full tw-max-w-[700px]">
        <Image
          src="https://i.imgur.com/lFqauaw.png"
          alt="full-width-follow-up-query-box"
          className="tw-w-full"
        />
      </div>
    </div>
  );
}
