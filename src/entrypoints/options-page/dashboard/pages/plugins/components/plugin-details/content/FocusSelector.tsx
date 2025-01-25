import { createListCollection } from "@ark-ui/react";

import { Image } from "@/components/ui/image";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { P } from "@/components/ui/typography";
import {
  FOCUS_MODES,
  FocusMode,
} from "@/data/plugins/better-focus-selector/focus-modes";
import { ExtensionLocalStorage } from "@/services/extension-local-storage/extension-local-storage.types";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

type ModeType = NonNullable<
  ExtensionLocalStorage["plugins"]["queryBox:focusSelector"]["mode"]
>;

const MODE_LABELS: Record<ModeType, string> = {
  default: "Always override",
  persistent: "Persistent across sessions",
};

const MODE_OPTIONS: ModeType[] = ["default", "persistent"];

export default function FocusSelectorPluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();
  const pluginSettings = settings?.plugins["queryBox:focusSelector"];

  const handleEnableChange = (checked: boolean) => {
    mutation.mutate((draft) => {
      draft.plugins["queryBox:focusSelector"].enabled = checked;
    });
  };

  const handleModeChange = (value: string[]) => {
    mutation.mutate((draft) => {
      draft.plugins["queryBox:focusSelector"].mode = value[0] as ModeType;
    });
  };

  if (!settings) return null;

  return (
    <div className="x-flex x-max-w-lg x-flex-col x-gap-4">
      <P>Please note that this plugin does not work on Enterprise accounts</P>
      <Switch
        textLabel="Enable"
        checked={pluginSettings?.enabled ?? false}
        onCheckedChange={({ checked }) => handleEnableChange(checked)}
      />

      {settings.plugins["queryBox:focusSelector"].enabled && (
        <div className="x-flex x-items-end x-gap-4">
          <div>
            <Label className="x-text-muted-foreground">Mode</Label>
            <Select
              portal={false}
              collection={createListCollection<ModeType>({
                items: MODE_OPTIONS,
                itemToString: (item) => MODE_LABELS[item],
              })}
              value={[pluginSettings?.mode ?? "default"]}
              positioning={{ sameWidth: true }}
              onValueChange={({ value }) => handleModeChange(value)}
            >
              <SelectTrigger variant="default" className="x-w-fit x-p-4 x-py-2">
                <SelectValue placeholder="Mode" />
              </SelectTrigger>
              <SelectContent>
                {MODE_OPTIONS.map((option) => (
                  <SelectItem key={option} item={option}>
                    {MODE_LABELS[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {settings.plugins["queryBox:focusSelector"].mode === "default" && (
            <Select
              value={[pluginSettings?.defaultFocusMode ?? "internet"]}
              collection={createListCollection({
                items: FOCUS_MODES,
                itemToString: (item) => item.label,
              })}
              onValueChange={({ value }) => {
                mutation.mutate((draft) => {
                  draft.plugins["queryBox:focusSelector"].defaultFocusMode =
                    value[0] as FocusMode["code"];
                });
              }}
            >
              <SelectTrigger variant="default" className="x-w-fit x-p-4 x-py-2">
                <SelectValue placeholder="Default Focus Mode">
                  {(() => {
                    const mode = FOCUS_MODES.find(
                      (mode) => mode.code === pluginSettings?.defaultFocusMode,
                    );
                    if (!mode) return null;
                    return (
                      <div className="x-flex x-items-center x-gap-2">
                        <mode.Icon className="x-size-4" />
                        <div>{mode.label}</div>
                      </div>
                    );
                  })()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {FOCUS_MODES.map((mode) => (
                  <SelectItem
                    key={mode.code}
                    item={mode.code}
                    className="x-flex x-items-center x-gap-2"
                  >
                    <mode.Icon className="x-size-4" />
                    <div>{mode.label}</div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}
      <div className="x-mx-auto x-w-full x-max-w-[700px]">
        <Image
          src="https://i.imgur.com/qI4hFOA.png"
          alt="focus-selector"
          className="x-w-full"
        />
      </div>
    </div>
  );
}
