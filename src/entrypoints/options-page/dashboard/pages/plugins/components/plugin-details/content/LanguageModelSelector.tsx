import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import { P } from "@/components/ui/typography";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function LanguageModelSelectorPluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();

  if (!settings) return null;

  return (
    <div className="x-flex x-flex-col x-gap-4 x-overflow-y-auto">
      <P>
        Allow you to change your preferred language model{" "}
        <span className="x-font-medium x-text-primary x-underline">
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
        <div className="x-flex x-flex-col x-gap-2">
          <div className="x-ml-8 x-flex x-flex-col x-gap-2">
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
            <Switch
              className="x-ml-8 x-items-start"
              textLabel={
                <div>
                  <div className="x-text-sm">
                    Respect default Space&apos;s model
                  </div>
                  <div className="x-text-sm x-text-muted-foreground">
                    Automatically switch to the default model when entering a
                    Space
                  </div>
                </div>
              }
              checked={
                settings.plugins["queryBox:languageModelSelector"]
                  .respectDefaultSpaceModel ?? false
              }
              onCheckedChange={({ checked }) => {
                mutation.mutate((draft) => {
                  draft.plugins[
                    "queryBox:languageModelSelector"
                  ].respectDefaultSpaceModel = checked;
                });
              }}
            />
            <div className="x-flex x-flex-col x-gap-2">
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
      <div className="x-mx-auto x-w-full x-max-w-[700px]">
        <Image
          src="https://i.imgur.com/IBClpp3.png"
          alt="language-model-selector"
          className="x-w-full"
        />
      </div>
    </div>
  );
}
