import { Switch } from "@/components/ui/switch";
import { P } from "@/components/ui/typography";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function CollapseEmptyThreadVisualColsPluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();

  if (!settings) return null;

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <P>
        Remove the empty space on the right side of each message in a thread.
        Only for messages that explicitly don&apos;t have &quot;Search images,
        Search videos, Generate Images&quot; options on the right.
      </P>
      <Switch
        textLabel="Enable"
        checked={
          settings?.plugins["thread:collapseEmptyThreadVisualCols"].enabled
        }
        onCheckedChange={({ checked }) =>
          mutation.mutate(
            (draft) =>
              (draft.plugins["thread:collapseEmptyThreadVisualCols"].enabled =
                checked),
          )
        }
      />
      <img
        src="https://i.imgur.com/DqXvaZp.png"
        alt="collapse-empty-thread-visual-cols"
      />
    </div>
  );
}
