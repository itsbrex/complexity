import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import { P } from "@/components/ui/typography";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function LanguageModelSelectorPluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();

  if (!settings) return null;

  return (
    <div className="tw-flex tw-flex-col tw-gap-4 tw-overflow-y-auto">
      <P>
        Allow you to change your preferred language model{" "}
        <span className="tw-font-medium tw-text-primary tw-underline">
          anywhere
        </span>
        . The selector can be found on all query boxes.
      </P>
      <Switch
        textLabel="Enable"
        checked={
          settings.plugins["queryBox:languageModelSelector"].enabled ?? false
        }
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["queryBox:languageModelSelector"].enabled = checked;
          });
        }}
      />
      {settings.plugins["queryBox:languageModelSelector"].enabled && (
        <div className="tw-flex tw-flex-col tw-gap-2">
          <div className="tw-ml-8 tw-flex tw-flex-col tw-gap-2">
            <Switch
              textLabel="Homepage + Modal + Space"
              checked={
                settings.plugins["queryBox:languageModelSelector"].main ?? false
              }
              onCheckedChange={({ checked }) => {
                mutation.mutate((draft) => {
                  draft.plugins["queryBox:languageModelSelector"].main =
                    checked;
                });
              }}
            />
            <div className="tw-flex tw-flex-col tw-gap-2">
              <Switch
                textLabel="Follow-up (in a thread)"
                checked={
                  settings.plugins["queryBox:languageModelSelector"].followUp ??
                  false
                }
                onCheckedChange={({ checked }) => {
                  mutation.mutate((draft) => {
                    draft.plugins["queryBox:languageModelSelector"].followUp =
                      checked;
                  });
                }}
              />
            </div>
          </div>
          {settings.devMode && (
            <Switch
              textLabel="Change timezone"
              checked={
                settings.plugins["queryBox:languageModelSelector"]
                  .changeTimezone ?? false
              }
              onCheckedChange={({ checked }) => {
                mutation.mutate((draft) => {
                  draft.plugins[
                    "queryBox:languageModelSelector"
                  ].changeTimezone = checked;
                });
              }}
            />
          )}
        </div>
      )}
      <div className="tw-mx-auto tw-w-full tw-max-w-[700px]">
        <Image
          src="https://i.imgur.com/IBClpp3.png"
          alt="language-model-selector"
          className="tw-w-full"
        />
      </div>
    </div>
  );
}
