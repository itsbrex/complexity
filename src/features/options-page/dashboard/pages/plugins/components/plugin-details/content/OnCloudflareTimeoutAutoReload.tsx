import { createListCollection } from "@ark-ui/react";

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
import { ExtensionLocalStorage } from "@/services/extension-local-storage/extension-local-storage.types";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

type BehaviorType =
  ExtensionLocalStorage["plugins"]["onCloudflareTimeoutAutoReload"]["behavior"];

const BEHAVIOR_LABELS: Record<BehaviorType, string> = {
  reload: "Reload",
  "warn-only": "Warn only",
};

const BEHAVIOR_OPTIONS: BehaviorType[] = ["reload", "warn-only"];

export default function OnCloudflareTimeoutAutoReloadPluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();
  const pluginSettings = settings?.plugins["onCloudflareTimeoutAutoReload"];

  const handleEnableChange = (checked: boolean) => {
    mutation.mutate((draft) => {
      draft.plugins["onCloudflareTimeoutAutoReload"].enabled = checked;
    });
  };

  const handleBehaviorChange = (value: string[]) => {
    mutation.mutate((draft) => {
      draft.plugins["onCloudflareTimeoutAutoReload"].behavior =
        value[0] as BehaviorType;
    });
  };

  if (!settings) return null;

  return (
    <div className="tw-flex tw-max-w-lg tw-flex-col tw-gap-4">
      <P className="tw-text-balance">
        Helpful when you are using VPNs, or when Perplexity/Cloudflare has
        issues with your ISP. Turn this on if you want to automatically reload
        the page when this occurs.
      </P>
      <Switch
        textLabel="Enable"
        checked={pluginSettings?.enabled ?? false}
        onCheckedChange={({ checked }) => handleEnableChange(checked)}
      />

      <div>
        <Label className="tw-text-muted-foreground">Behavior</Label>
        <Select
          portal={false}
          collection={createListCollection<BehaviorType>({
            items: BEHAVIOR_OPTIONS,
            itemToString: (item) => BEHAVIOR_LABELS[item],
          })}
          value={[pluginSettings?.behavior ?? "reload"]}
          positioning={{ sameWidth: true }}
          onValueChange={({ value }) => handleBehaviorChange(value)}
        >
          <SelectTrigger variant="default" className="tw-w-fit tw-p-4 tw-py-2">
            <SelectValue placeholder="Behavior" />
          </SelectTrigger>
          <SelectContent>
            {BEHAVIOR_OPTIONS.map((option) => (
              <SelectItem key={option} item={option}>
                {BEHAVIOR_LABELS[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
