import debounce from "lodash/debounce";
import { useMemo } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import CodeThemeSelector from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content/better-code-blocks/CodeThemeSelector";
import useOptions from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content/better-code-blocks/useOptions";

export default function BetterCodeBlockGlobalOptions() {
  const { globalMutation: mutation, globalSettings: settings } = useOptions();

  const debouncedMutate = useMemo(
    () =>
      debounce(
        (mutator: (draft: any) => void) => mutation.mutate(mutator),
        300,
      ),
    [mutation],
  );

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <div className="tw-flex tw-flex-col tw-gap-2">
        <Switch
          textLabel="Code theme"
          checked={settings?.plugins["thread:betterCodeBlocks"].theme.enabled}
          onCheckedChange={({ checked }) => {
            mutation.mutate((draft) => {
              draft.plugins["thread:betterCodeBlocks"].theme.enabled = checked;
            });
          }}
        />
        {settings?.plugins["thread:betterCodeBlocks"].theme.enabled && (
          <div className="tw-flex tw-w-full tw-gap-4">
            <div className="tw-flex tw-flex-col tw-gap-2">
              <Label className="tw-text-muted-foreground">Dark</Label>
              <CodeThemeSelector
                value={settings?.plugins["thread:betterCodeBlocks"].theme.dark}
                onValueChange={(value) => {
                  mutation.mutate((draft) => {
                    draft.plugins["thread:betterCodeBlocks"].theme.dark = value;
                  });
                }}
              />
            </div>
            <div className="tw-flex tw-flex-col tw-gap-2">
              <Label className="tw-text-muted-foreground">Light</Label>
              <CodeThemeSelector
                value={settings?.plugins["thread:betterCodeBlocks"].theme.light}
                onValueChange={(value) => {
                  mutation.mutate((draft) => {
                    draft.plugins["thread:betterCodeBlocks"].theme.light =
                      value;
                  });
                }}
              />
            </div>
          </div>
        )}
      </div>
      <div className="tw-flex tw-flex-col tw-gap-4">
        <Switch
          textLabel="Sticky header"
          checked={settings?.plugins["thread:betterCodeBlocks"].stickyHeader}
          onCheckedChange={({ checked }) => {
            mutation.mutate((draft) => {
              draft.plugins["thread:betterCodeBlocks"].stickyHeader = checked;
            });
          }}
        />
        <div className="tw-flex tw-flex-col tw-gap-2">
          <Switch
            textLabel="Unwrap lines by default"
            checked={
              settings?.plugins["thread:betterCodeBlocks"].unwrap.enabled
            }
            onCheckedChange={({ checked }) => {
              mutation.mutate((draft) => {
                draft.plugins["thread:betterCodeBlocks"].unwrap.enabled =
                  checked;
              });
            }}
          />
          <Switch
            textLabel="Show toggle button"
            className="tw-ml-8"
            checked={
              settings?.plugins["thread:betterCodeBlocks"].unwrap
                .showToggleButton
            }
            onCheckedChange={({ checked }) => {
              mutation.mutate((draft) => {
                draft.plugins[
                  "thread:betterCodeBlocks"
                ].unwrap.showToggleButton = checked;
              });
            }}
          />
        </div>
        <div className="tw-flex tw-flex-col tw-gap-2">
          <div className="tw-flex tw-gap-2">
            <Switch
              textLabel="Max height"
              checked={
                settings?.plugins["thread:betterCodeBlocks"].maxHeight?.enabled
              }
              onCheckedChange={({ checked }) => {
                mutation.mutate((draft) => {
                  draft.plugins["thread:betterCodeBlocks"].maxHeight.enabled =
                    checked;
                });
              }}
            />
            <div className="tw-flex tw-items-center tw-gap-2">
              <Input
                type="number"
                min={300}
                defaultValue={
                  settings?.plugins["thread:betterCodeBlocks"].maxHeight?.value
                }
                className="tw-w-[100px]"
                disabled={
                  !settings?.plugins["thread:betterCodeBlocks"].maxHeight
                    ?.enabled
                }
                onChange={(e) => {
                  if (Number(e.target.value) < 300) {
                    return;
                  }
                  debouncedMutate((draft) => {
                    draft.plugins["thread:betterCodeBlocks"].maxHeight.value =
                      Number(e.target.value);
                  });
                }}
              />
              <div className="tw-text-muted-foreground">px (&gt;= 300px)</div>
            </div>
          </div>
          <Switch
            textLabel="Show toggle button"
            className="tw-ml-8"
            checked={
              settings?.plugins["thread:betterCodeBlocks"].maxHeight
                ?.showToggleButton
            }
            onCheckedChange={({ checked }) => {
              mutation.mutate((draft) => {
                draft.plugins[
                  "thread:betterCodeBlocks"
                ].maxHeight.showToggleButton = checked;
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
