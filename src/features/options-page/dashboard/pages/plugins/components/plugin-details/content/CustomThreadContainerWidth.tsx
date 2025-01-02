import debounce from "lodash/debounce";

import {
  Slider,
  SliderContext,
  SliderControl,
  SliderLabel,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function CustomThreadContainerWidthPluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();

  const debouncedMutation = useMemo(
    () =>
      debounce((newValue: number) => {
        mutation.mutate(
          (draft) =>
            (draft.plugins["thread:customThreadContainerWidth"].value =
              newValue),
        );
      }, 300),
    [mutation],
  );

  if (!settings) return null;

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <Switch
        textLabel="Enable"
        checked={settings?.plugins["thread:customThreadContainerWidth"].enabled}
        onCheckedChange={({ checked }) =>
          mutation.mutate(
            (draft) =>
              (draft.plugins["thread:customThreadContainerWidth"].enabled =
                checked),
          )
        }
      />
      {settings?.plugins["thread:customThreadContainerWidth"].enabled && (
        <div className="tw-flex tw-flex-col tw-gap-2">
          <Slider
            defaultValue={[
              settings.plugins["thread:customThreadContainerWidth"].value,
            ]}
            className="md:tw-min-w-[500px]"
            min={768}
            max={9999}
            onValueChange={({ value }) => debouncedMutation(value[0] ?? 0)}
          >
            <SliderContext>
              {({ value }) => (
                <SliderLabel className="tw-mb-4 tw-block tw-text-muted-foreground">
                  Desired Max-Width:{" "}
                  <span className="tw-text-primary">{value}px</span>
                </SliderLabel>
              )}
            </SliderContext>
            <SliderControl>
              <SliderTrack>
                <SliderRange />
                <SliderThumb index={0} />
              </SliderTrack>
            </SliderControl>
          </Slider>
        </div>
      )}
    </div>
  );
}
