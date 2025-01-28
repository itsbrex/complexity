import KeyCombo from "@/components/KeyCombo";
import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import { P } from "@/components/ui/typography";
import { getPlatform } from "@/hooks/usePlatformDetection";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function InstantThreadMessageRewriteButtonsPluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();
  const pluginSettings = settings?.plugins["thread:instantRewriteButton"];

  if (!settings) return null;

  return (
    <div className="x-flex x-max-w-lg x-flex-col x-gap-4">
      <P>
        You can also use{" "}
        <KeyCombo
          keys={[
            getPlatform() === "mac" ? Key.Meta : Key.Control,
            "Left Click",
          ]}
        />{" "}
        on the original Rewrite button
      </P>
      <Switch
        textLabel="Enable"
        checked={pluginSettings?.enabled ?? false}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["thread:instantRewriteButton"].enabled = checked;
          });
        }}
      />

      <div className="x-mx-auto x-w-full x-max-w-[700px]">
        <Image
          src="https://i.imgur.com/kxOEU77.png"
          alt="better-thread-message-rewrite-buttons"
          className="x-w-full"
        />
      </div>
    </div>
  );
}
