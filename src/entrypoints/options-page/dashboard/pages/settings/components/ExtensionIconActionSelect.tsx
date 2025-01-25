import { createListCollection } from "@ark-ui/react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  EXTENSION_ICON_ACTIONS as OPTIONS,
  EXTENSION_ICON_ACTIONS_LABEL as OPTIONS_LABEL,
} from "@/data/dashboard/extension-storage";
import { ExtensionLocalStorage } from "@/services/extension-local-storage/extension-local-storage.types";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function ExtensionIconActionSelect() {
  const { settings, mutation } = useExtensionLocalStorage();

  if (!settings) return null;

  const selectedValue = settings?.extensionIconAction;

  return (
    <Select
      collection={createListCollection({
        items: OPTIONS,
        itemToString(item) {
          return OPTIONS_LABEL[item as keyof typeof OPTIONS_LABEL];
        },
      })}
      value={[selectedValue]}
      onValueChange={({ value }) => {
        mutation.mutate(
          (draft) =>
            (draft.extensionIconAction =
              value[0] as ExtensionLocalStorage["extensionIconAction"]),
        );
      }}
    >
      <SelectTrigger>
        <Button asChild className="tw-p-0">
          <span>{OPTIONS_LABEL[selectedValue]}</span>
        </Button>
      </SelectTrigger>
      <SelectContent>
        {OPTIONS.map((option) => (
          <SelectItem key={option} item={option}>
            {OPTIONS_LABEL[option as keyof typeof OPTIONS_LABEL]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
