import { Trans } from "react-i18next";

import { Switch } from "@/components/ui/switch";
import { P } from "@/components/ui/typography";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function LanguageModelSelectorPluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();

  if (!settings) return null;

  return (
    <div className="tw-flex tw-flex-col tw-gap-4 tw-overflow-y-auto">
      <P>
        <Trans
          i18nKey="dashboard-plugins-page:pluginDetails.languageModelSelector.description"
          components={{
            emphasis: (
              <span className="tw-font-medium tw-text-primary tw-underline" />
            ),
          }}
        />
      </P>
      <Switch
        textLabel={t("action.enable")}
        checked={
          settings?.plugins["queryBox:languageModelSelector"].enabled ?? false
        }
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["queryBox:languageModelSelector"].enabled = checked;
          });
        }}
      />
      {settings.plugins["queryBox:languageModelSelector"].enabled && (
        <div className="tw-ml-8 tw-flex tw-flex-col tw-gap-2">
          <Switch
            textLabel={t(
              "dashboard-plugins-page:pluginDetails.languageModelSelector.mainLocations",
            )}
            checked={
              settings.plugins["queryBox:languageModelSelector"].main ?? false
            }
            onCheckedChange={({ checked }) => {
              mutation.mutate((draft) => {
                draft.plugins["queryBox:languageModelSelector"].main = checked;
              });
            }}
          />
          <div className="tw-flex tw-flex-col tw-gap-2">
            <Switch
              textLabel={t(
                "dashboard-plugins-page:pluginDetails.languageModelSelector.followUp.enable",
              )}
              checked={
                settings.plugins["queryBox:languageModelSelector"].followUp
                  .enabled ?? false
              }
              onCheckedChange={({ checked }) => {
                mutation.mutate((draft) => {
                  draft.plugins[
                    "queryBox:languageModelSelector"
                  ].followUp.enabled = checked;
                });
              }}
            />
            {settings.plugins["queryBox:languageModelSelector"].followUp
              .enabled && (
              <Switch
                className="tw-ml-8"
                textLabel={t(
                  "dashboard-plugins-page:pluginDetails.languageModelSelector.followUp.spanFullWidth",
                )}
                checked={
                  settings.plugins["queryBox:languageModelSelector"].followUp
                    .span
                }
                onCheckedChange={({ checked }) => {
                  mutation.mutate((draft) => {
                    draft.plugins[
                      "queryBox:languageModelSelector"
                    ].followUp.span = checked;
                  });
                }}
              />
            )}
          </div>
        </div>
      )}
      <img
        src="https://i.imgur.com/IBClpp3.png"
        alt="language-model-selector"
        className="tw-mx-auto tw-w-full tw-max-w-[700px]"
      />
    </div>
  );
}
