import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function CustomHomeSloganPluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();

  if (!settings) return null;

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <Switch
        textLabel="Enable"
        checked={settings?.plugins["home:customSlogan"].enabled}
        onCheckedChange={({ checked }) =>
          mutation.mutate(
            (draft) => (draft.plugins["home:customSlogan"].enabled = checked),
          )
        }
      />
      <div className="tw-flex tw-flex-col tw-gap-2">
        <Label className="tw-text-muted-foreground">Slogan</Label>
        <Input
          value={settings?.plugins["home:customSlogan"].slogan}
          onChange={({ target: { value } }) =>
            mutation.mutate(
              (draft) => (draft.plugins["home:customSlogan"].slogan = value),
            )
          }
        />
      </div>
    </div>
  );
}
