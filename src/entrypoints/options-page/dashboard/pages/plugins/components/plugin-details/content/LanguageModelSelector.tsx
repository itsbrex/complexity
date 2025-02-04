import { LuCheck } from "react-icons/lu";

import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import { P } from "@/components/ui/typography";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function LanguageModelSelectorPluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();

  if (!settings) return null;

  return (
    <div className="x-flex x-flex-col x-gap-4 x-overflow-y-auto">
      <P className="x-my-0">
        <div className="x-flex x-items-center x-gap-2">
          <LuCheck className="x-text-primary" /> Take complete control of all
          available language models.
        </div>
        <div className="x-flex x-items-center x-gap-2">
          <LuCheck className="x-text-primary" /> No ambiguity, no confusion,
          change your preferred one anywhere.
        </div>
        <div className="x-flex x-items-center x-gap-2">
          <LuCheck className="x-text-primary" /> Supports keyboard navigation.
        </div>
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
          <Switch
            className="x-items-start"
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
          src="https://i.imgur.com/19WKLlf.png"
          alt="language-model-selector"
          className="x-w-full"
        />
      </div>
    </div>
  );
}
