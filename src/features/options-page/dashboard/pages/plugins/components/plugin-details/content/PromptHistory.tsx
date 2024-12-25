import { Switch } from "@/components/ui/switch";
import { P } from "@/components/ui/typography";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function PromptHistoryPluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();
  const pluginSettings =
    settings?.plugins["queryBox:slashCommandMenu:promptHistory"];

  const handleEnableChange = (checked: boolean) => {
    mutation.mutate((draft) => {
      draft.plugins["queryBox:slashCommandMenu:promptHistory"].enabled =
        checked;
    });
  };

  if (!settings) return null;

  return (
    <div className="tw-flex tw-max-w-lg tw-flex-col tw-gap-4">
      <P>
        Frustrated when losing your prompt? This plugin will save your prompt to
        history and allow you to easily access it.
      </P>
      <Switch
        textLabel="Enable"
        checked={pluginSettings?.enabled ?? false}
        onCheckedChange={({ checked }) => handleEnableChange(checked)}
      />

      {pluginSettings?.enabled && (
        <div className="tw-ml-8 tw-flex tw-flex-col tw-gap-2">
          <Switch
            className="tw-items-start"
            textLabel={
              <div>
                <div>Save on submit</div>
                <div className="tw-text-sm tw-text-muted-foreground">
                  When you submit a new prompt
                </div>
              </div>
            }
            checked={pluginSettings?.trigger.onSubmit ?? false}
            onCheckedChange={({ checked }) => {
              mutation.mutate((draft) => {
                draft.plugins[
                  "queryBox:slashCommandMenu:promptHistory"
                ].trigger.onSubmit = checked;
              });
            }}
          />
          <Switch
            className="tw-items-start"
            textLabel={
              <div>
                <div>Save on navigation</div>
                <div className="tw-text-sm tw-text-muted-foreground">
                  When you (accidentally) navigate away from the page (or when
                  Perplexity forces the page to reload)
                </div>
              </div>
            }
            checked={pluginSettings?.trigger.onNavigation ?? false}
            onCheckedChange={({ checked }) => {
              mutation.mutate((draft) => {
                draft.plugins[
                  "queryBox:slashCommandMenu:promptHistory"
                ].trigger.onNavigation = checked;
              });
            }}
          />
        </div>
      )}
    </div>
  );
}
