import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import { Plugins } from "@/services/extension-local-storage/plugins.types";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function BetterThreadMessageToolbarsPluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();

  const handleCheckedChange = useCallback(
    (key: keyof Plugins["thread:betterMessageToolbars"]) =>
      ({ checked }: { checked: boolean }) =>
        mutation.mutate((draft) => {
          draft.plugins["thread:betterMessageToolbars"][key] = checked;
        }),
    [mutation],
  );

  return (
    <div className="tw-flex tw-flex-col tw-gap-4 tw-overflow-y-auto">
      <div className="tw-flex tw-flex-col tw-gap-2">
        Useful tweaks to make the toolbar more compact and easier to use.
      </div>
      <Switch
        textLabel="Enable"
        checked={settings?.plugins["thread:betterMessageToolbars"].enabled}
        onCheckedChange={handleCheckedChange("enabled")}
      />
      {settings?.plugins["thread:betterMessageToolbars"].enabled && (
        <div className="tw-flex tw-flex-col tw-gap-2">
          <div className="tw-text-sm tw-text-muted-foreground">Options</div>
          <Switch
            className="tw-items-start"
            textLabel={
              <div>
                <div>Stick to top</div>
                <div className="tw-text-sm tw-text-muted-foreground">
                  Always keep the toolbar visible at the top of the page when
                  scrolling
                </div>
              </div>
            }
            checked={settings?.plugins["thread:betterMessageToolbars"].sticky}
            onCheckedChange={handleCheckedChange("sticky")}
          />
          <Switch
            className="tw-items-start"
            textLabel={
              <div>
                <div>Simplify Rewrite Dropdown Menu</div>
                <div className="tw-text-sm tw-text-muted-foreground">
                  Hide model&apos;s description (only for desktop)
                </div>
              </div>
            }
            checked={
              settings?.plugins["thread:betterMessageToolbars"]
                .simplifyRewriteDropdown
            }
            onCheckedChange={handleCheckedChange("simplifyRewriteDropdown")}
          />
          <Switch
            className="tw-items-start"
            textLabel={
              <div>
                <div>Hide Unnecessary Buttons</div>
                <div className="tw-text-sm tw-text-muted-foreground">
                  Hide Share, Thumbs Up/Down buttons
                </div>
              </div>
            }
            checked={
              settings?.plugins["thread:betterMessageToolbars"]
                .hideUnnecessaryButtons
            }
            onCheckedChange={handleCheckedChange("hideUnnecessaryButtons")}
          />
          <Switch
            className="tw-items-start"
            textLabel={
              <div>
                <div>Explicit Model Name</div>
                <div className="tw-text-sm tw-text-muted-foreground">
                  Show the model name without hovering
                </div>
              </div>
            }
            checked={
              settings?.plugins["thread:betterMessageToolbars"]
                .explicitModelName
            }
            onCheckedChange={handleCheckedChange("explicitModelName")}
          />
          <Switch
            className="tw-items-start"
            textLabel={
              <div>
                <div>Word and Character Count</div>
                <div className="tw-text-sm tw-text-muted-foreground">
                  Show words and characters count
                </div>
              </div>
            }
            checked={
              settings?.plugins["thread:betterMessageToolbars"]
                .wordsAndCharactersCount
            }
            onCheckedChange={handleCheckedChange("wordsAndCharactersCount")}
          />
          {settings.plugins["thread:betterMessageToolbars"]
            .wordsAndCharactersCount && (
            <Switch
              className="tw-items-start"
              textLabel={
                <div>
                  <div>Estimated Token Count</div>
                  <div className="tw-text-sm tw-text-muted-foreground">
                    Tokens are calculated by dividing visible characters by 4
                    and do NOT include web sources/attachments
                  </div>
                </div>
              }
              checked={
                settings?.plugins["thread:betterMessageToolbars"].tokensCount
              }
              onCheckedChange={handleCheckedChange("tokensCount")}
            />
          )}
        </div>
      )}
      <div className="tw-mx-auto tw-w-full tw-max-w-[700px]">
        <Image
          src="https://i.imgur.com/xxqkuDn.png"
          alt="better-thread-message-toolbars"
          className="tw-w-full"
        />
      </div>
    </div>
  );
}
