import { createListCollection } from "@ark-ui/react";
import { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ExtensionLocalStorage } from "@/services/extension-local-storage/extension-local-storage.types";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

const DESCRIPTION: Record<
  ExtensionLocalStorage["plugins"]["thread:canvas"]["mode"],
  ReactNode
> = {
  manual: "Manually click on the render button to preview the code",
  auto: (
    <span>
      Autonomous mode, requires this{" "}
      <a
        href="https://cdn.cplx.app/prompts/canvas-instruction-claude.md"
        target="_blank"
        rel="noopener noreferrer"
        className="tw-text-primary tw-underline"
      >
        pre-prompt
      </a>{" "}
      to work. You can either paste the prompt directly alongside your query or
      use Space&apos;s instruction.
    </span>
  ),
};

export default function CanvasPluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <Switch
        textLabel="Enable"
        checked={settings?.plugins["thread:canvas"].enabled}
        onCheckedChange={({ checked }) =>
          mutation.mutate(
            (draft) => (draft.plugins["thread:canvas"].enabled = checked),
          )
        }
      />

      {settings?.plugins["thread:canvas"].enabled && (
        <div className="tw-flex tw-flex-col tw-gap-2">
          <Select
            className="tw-w-max"
            value={[settings?.plugins["thread:canvas"].mode ?? "manual"]}
            collection={createListCollection<{
              label: string;
              value: ExtensionLocalStorage["plugins"]["thread:canvas"]["mode"];
            }>({
              items: [
                {
                  label: "Manual",
                  value: "manual",
                },
                {
                  label: "Autonomous",
                  value: "auto",
                },
              ],
              itemToString(item) {
                return item.label;
              },
              itemToValue(item) {
                return item.value;
              },
            })}
            onValueChange={({ value }) =>
              mutation.mutate((draft) => {
                draft.plugins["thread:canvas"].mode =
                  value[0] as ExtensionLocalStorage["plugins"]["thread:canvas"]["mode"];
              })
            }
          >
            <Label className="tw-text-muted-foreground">Mode</Label>
            <SelectTrigger>
              <SelectValue className="tw-py-2" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem item="manual">Manual</SelectItem>
              <SelectItem item="auto">Autonomous</SelectItem>
            </SelectContent>
          </Select>
          <div>
            {DESCRIPTION[settings?.plugins["thread:canvas"].mode ?? "manual"]}
          </div>
        </div>
      )}
    </div>
  );
}
