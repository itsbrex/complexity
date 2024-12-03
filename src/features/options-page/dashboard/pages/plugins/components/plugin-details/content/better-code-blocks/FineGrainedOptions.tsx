import debounce from "lodash/debounce";
import { useMemo } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import CodeThemeSelector from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content/better-code-blocks/CodeThemeSelector";
import { DeleteLanguageOptionButton } from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content/better-code-blocks/DeleteLanguageOptionButton";
import useOptions from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content/better-code-blocks/useOptions";

export default function BetterCodeBlockFineGrainedOptions({
  language,
}: {
  language: string;
}) {
  const {
    mutation,
    settings,
    delete: deleteMutation,
  } = useOptions({ language });

  const debouncedMutate = useMemo(
    () =>
      debounce(
        (newDraft: any) =>
          mutation.mutate({
            language,
            newDraft,
          }),
        300,
      ),
    [language, mutation],
  );

  if (!settings) return null;

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <div className="tw-flex tw-flex-col tw-gap-2">
        <Switch
          textLabel={t(
            "dashboard-plugins-page:pluginDetails.betterCodeBlocks.codeTheme.label",
          )}
          checked={settings?.theme.enabled}
          onCheckedChange={({ checked }) => {
            mutation.mutate({
              language,
              newDraft: {
                theme: {
                  enabled: checked,
                },
              },
            });
          }}
        />
        {settings?.theme.enabled && (
          <div className="tw-flex tw-w-full tw-gap-4">
            <div className="tw-flex tw-flex-col tw-gap-2">
              <Label className="tw-text-muted-foreground">
                {t(
                  "dashboard-plugins-page:pluginDetails.betterCodeBlocks.codeTheme.dark",
                )}
              </Label>
              <CodeThemeSelector
                value={settings?.theme.dark}
                onValueChange={(value) => {
                  mutation.mutate({
                    language,
                    newDraft: {
                      theme: {
                        dark: value,
                      },
                    },
                  });
                }}
              />
            </div>
            <div className="tw-flex tw-flex-col tw-gap-2">
              <Label className="tw-text-muted-foreground">
                {t(
                  "dashboard-plugins-page:pluginDetails.betterCodeBlocks.codeTheme.light",
                )}
              </Label>
              <CodeThemeSelector
                value={settings?.theme.light}
                onValueChange={(value) => {
                  mutation.mutate({
                    language,
                    newDraft: {
                      theme: {
                        light: value,
                      },
                    },
                  });
                }}
              />
            </div>
          </div>
        )}
      </div>
      <div className="tw-flex tw-flex-col tw-gap-4">
        <Switch
          textLabel={t(
            "dashboard-plugins-page:pluginDetails.betterCodeBlocks.options.stickyHeader",
          )}
          checked={settings?.stickyHeader}
          onCheckedChange={({ checked }) => {
            mutation.mutate({
              language,
              newDraft: {
                stickyHeader: checked,
              },
            });
          }}
        />
        <div className="tw-flex tw-flex-col tw-gap-2">
          <Switch
            textLabel={t(
              "dashboard-plugins-page:pluginDetails.betterCodeBlocks.options.unwrapLines.label",
            )}
            checked={settings?.unwrap.enabled}
            onCheckedChange={({ checked }) => {
              mutation.mutate({
                language,
                newDraft: {
                  unwrap: {
                    enabled: checked,
                  },
                },
              });
            }}
          />
          <Switch
            textLabel={t(
              "dashboard-plugins-page:pluginDetails.betterCodeBlocks.options.unwrapLines.toggleButton",
            )}
            className="tw-ml-8"
            checked={settings?.unwrap.showToggleButton}
            onCheckedChange={({ checked }) => {
              mutation.mutate({
                language,
                newDraft: {
                  unwrap: {
                    showToggleButton: checked,
                  },
                },
              });
            }}
          />
        </div>
        <div className="tw-flex tw-flex-col tw-gap-2">
          <div className="tw-flex tw-gap-2">
            <Switch
              textLabel={t(
                "dashboard-plugins-page:pluginDetails.betterCodeBlocks.options.maxHeight.label",
              )}
              checked={settings?.maxHeight.enabled}
              onCheckedChange={({ checked }) => {
                mutation.mutate({
                  language,
                  newDraft: {
                    maxHeight: {
                      enabled: checked,
                    },
                  },
                });
              }}
            />
            <div className="tw-flex tw-items-center tw-gap-2">
              <Input
                type="number"
                min={0}
                defaultValue={settings?.maxHeight.value}
                className="tw-w-[100px]"
                disabled={!settings?.maxHeight.enabled}
                onChange={(e) => {
                  if (Number(e.target.value) < 0) {
                    return;
                  }
                  debouncedMutate({
                    maxHeight: {
                      value: Number(e.target.value),
                    },
                  });
                }}
              />
              <div className="tw-text-muted-foreground">
                {t(
                  "dashboard-plugins-page:pluginDetails.betterCodeBlocks.options.maxHeight.unit",
                )}
              </div>
            </div>
          </div>
          <Switch
            textLabel={t(
              "dashboard-plugins-page:pluginDetails.betterCodeBlocks.options.maxHeight.toggleButton",
            )}
            className="tw-ml-8"
            checked={settings?.maxHeight.showToggleButton}
            onCheckedChange={({ checked }) => {
              mutation.mutate({
                language,
                newDraft: {
                  maxHeight: {
                    showToggleButton: checked,
                  },
                },
              });
            }}
          />
          <div className="tw-flex tw-flex-col tw-gap-2">
            <Switch
              textLabel={t(
                "dashboard-plugins-page:pluginDetails.betterCodeBlocks.options.placeholderText.label",
              )}
              checked={settings?.placeholderText.enabled}
              onCheckedChange={({ checked }) => {
                mutation.mutate({
                  language,
                  newDraft: {
                    placeholderText: {
                      enabled: checked,
                    },
                  },
                });
              }}
            />
            {settings?.placeholderText.enabled && (
              <div className="tw-ml-8 tw-flex tw-flex-col tw-gap-2">
                <div>
                  <Label className="tw-text-muted-foreground">
                    {t(
                      "dashboard-plugins-page:pluginDetails.betterCodeBlocks.options.placeholderText.title",
                    )}
                  </Label>
                  <Input
                    type="text"
                    maxLength={30}
                    defaultValue={settings?.placeholderText.title}
                    className="tw-w-[300px]"
                    onChange={(e) => {
                      debouncedMutate({
                        placeholderText: { title: e.target.value },
                      });
                    }}
                  />
                </div>
                <div>
                  <Label className="tw-text-muted-foreground">
                    {t(
                      "dashboard-plugins-page:pluginDetails.betterCodeBlocks.options.placeholderText.loading",
                    )}
                  </Label>
                  <Input
                    type="text"
                    maxLength={30}
                    defaultValue={settings?.placeholderText.loading}
                    className="tw-w-[300px]"
                    onChange={(e) => {
                      debouncedMutate({
                        placeholderText: { loading: e.target.value },
                      });
                    }}
                  />
                </div>
                <div>
                  <Label className="tw-text-muted-foreground">
                    {t(
                      "dashboard-plugins-page:pluginDetails.betterCodeBlocks.options.placeholderText.idle",
                    )}
                  </Label>
                  <Input
                    type="text"
                    maxLength={30}
                    defaultValue={settings?.placeholderText.idle}
                    className="tw-w-[300px]"
                    onChange={(e) => {
                      debouncedMutate({
                        placeholderText: { idle: e.target.value },
                      });
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="tw-ml-auto tw-flex tw-flex-col tw-gap-2">
          <DeleteLanguageOptionButton deleteMutation={deleteMutation.mutate} />
        </div>
      </div>
    </div>
  );
}
