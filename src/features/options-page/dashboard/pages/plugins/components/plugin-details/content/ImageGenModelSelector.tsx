import { Switch } from "@/components/ui/switch";
import { P } from "@/components/ui/typography";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function ImageGenModelSelectorPluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();

  if (!settings) return null;

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <P>
        {t(
          "dashboard-plugins-page:pluginDetails.imageGenModelSelector.description",
        )}
      </P>
      <Switch
        textLabel={t("action.enable")}
        checked={settings?.plugins["imageGenModelSelector"].enabled ?? false}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["imageGenModelSelector"].enabled = checked;
          });
        }}
      />
      <img
        src="https://i.imgur.com/qf6cb9i.png"
        alt="image-gen-model-selector"
        className="tw-mx-auto tw-w-full tw-max-w-[700px]"
      />
    </div>
  );
}
