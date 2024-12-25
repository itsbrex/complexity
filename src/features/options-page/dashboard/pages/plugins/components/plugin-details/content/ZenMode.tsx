import { Switch } from "@/components/ui/switch";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function ZenModePluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <Switch
        textLabel="Enable"
        checked={settings?.plugins["zenMode"].enabled ?? false}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["zenMode"].enabled = checked;
          });
        }}
      />
      {settings?.plugins["zenMode"].enabled && (
        <Switch
          textLabel="Always hide related questions"
          checked={
            settings?.plugins["zenMode"].alwaysHideRelatedQuestions ?? false
          }
          onCheckedChange={({ checked }) => {
            mutation.mutate((draft) => {
              draft.plugins["zenMode"].alwaysHideRelatedQuestions = checked;
            });
          }}
        />
      )}
    </div>
  );
}
