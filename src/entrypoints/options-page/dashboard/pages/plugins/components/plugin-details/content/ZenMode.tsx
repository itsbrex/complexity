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
        <>
          <Switch
            textLabel="Persistent across reloads"
            checked={settings?.plugins["zenMode"].persistent ?? false}
            onCheckedChange={({ checked }) => {
              mutation.mutate((draft) => {
                draft.plugins["zenMode"].persistent = checked;
              });
            }}
          />
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
          <Switch
            textLabel="Always hide homepage widgets"
            checked={
              settings?.plugins["zenMode"].alwaysHideHomepageWidgets ?? false
            }
            onCheckedChange={({ checked }) => {
              mutation.mutate((draft) => {
                draft.plugins["zenMode"].alwaysHideHomepageWidgets = checked;
              });
            }}
          />
          <Switch
            textLabel="Always hide visual columns"
            checked={settings?.plugins["zenMode"].alwaysHideVisualCols ?? false}
            onCheckedChange={({ checked }) => {
              mutation.mutate((draft) => {
                draft.plugins["zenMode"].alwaysHideVisualCols = checked;
              });
            }}
          />
        </>
      )}
    </div>
  );
}
