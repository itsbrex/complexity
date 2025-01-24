import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import { P } from "@/components/ui/typography";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function SlashCommandMenuPluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();
  const pluginSettings = settings?.plugins["queryBox:slashCommandMenu"];

  const handleEnableChange = (checked: boolean) => {
    mutation.mutate((draft) => {
      draft.plugins["queryBox:slashCommandMenu"].enabled = checked;
    });
  };

  if (!settings) return null;

  return (
    <div className="tw-flex tw-max-w-lg tw-flex-col tw-gap-4">
      <P>
        This plugin allows you to use various slash commands to quickly access
        advanced features.
      </P>
      <Switch
        textLabel="Enable"
        checked={pluginSettings?.enabled ?? false}
        onCheckedChange={({ checked }) => handleEnableChange(checked)}
      />

      {pluginSettings?.enabled && (
        <div className="tw-flex tw-flex-col tw-gap-2">
          <Switch
            className="tw-items-start"
            textLabel="Show trigger button on the query box"
            checked={pluginSettings?.showTriggerButton ?? false}
            onCheckedChange={({ checked }) => {
              mutation.mutate((draft) => {
                draft.plugins["queryBox:slashCommandMenu"].showTriggerButton =
                  checked;
              });
            }}
          />
        </div>
      )}

      <div className="tw-mx-auto tw-w-full tw-max-w-[700px]">
        <Image
          src="https://i.imgur.com/9B9us0C.png"
          alt="slash-command-menu"
          className="tw-w-full"
        />
      </div>
    </div>
  );
}
