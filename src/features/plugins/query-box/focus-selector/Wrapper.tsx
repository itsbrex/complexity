import { createListCollection, SelectContext } from "@ark-ui/react";

import Tooltip from "@/components/Tooltip";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FocusMode,
  FOCUS_MODES,
} from "@/data/plugins/focus-selector/focus-modes";
import { DesktopSelectContent } from "@/features/plugins/query-box/focus-selector/components/DesktopSelectContent";
import { MobileSelectContent } from "@/features/plugins/query-box/focus-selector/components/MobileSelectContent";
import hideNativeFocusSelectorCss from "@/features/plugins/query-box/focus-selector/hide-native-focus-selector.css?inline";
import { useSharedQueryBoxStore } from "@/features/plugins/query-box/shared-store";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { useInsertCss } from "@/hooks/useInsertCss";
import { TEST_ID_SELECTORS } from "@/utils/dom-selectors";
import UiUtils from "@/utils/UiUtils";

export default function FocusSelectorWrapper() {
  const { isMobile } = useIsMobileStore();

  const { selectedFocusMode, setSelectedFocusMode } = useSharedQueryBoxStore(
    (state) => ({
      selectedFocusMode: state.selectedFocusMode,
      setSelectedFocusMode: state.setSelectedFocusMode,
    }),
  );

  const focusModeData =
    FOCUS_MODES.find((mode) => mode.code === selectedFocusMode) ??
    FOCUS_MODES[0]!;

  useInsertCss({
    id: "hide-native-focus-selector",
    css: hideNativeFocusSelectorCss,
  });

  return (
    <Select
      lazyMount
      unmountOnExit
      portal={false}
      collection={createListCollection({
        items: FOCUS_MODES,
        itemToString: (item) => item.label,
        itemToValue: (item) => item.code,
      })}
      value={[selectedFocusMode]}
      data-testid={TEST_ID_SELECTORS.QUERY_BOX.FOCUS_SELECTOR}
      onValueChange={({ value }) => {
        setSelectedFocusMode(value[0] as FocusMode["code"]);

        setTimeout(() => {
          UiUtils.getActiveQueryBoxTextarea().trigger("focus");
        }, 100);
      }}
      onKeyDown={(event) => {
        if (event.key === Key.Escape) {
          event.preventDefault();
          event.stopPropagation();

          setTimeout(() => {
            UiUtils.getActiveQueryBoxTextarea().trigger("focus");
          }, 100);
        }
      }}
    >
      <Tooltip
        content={t("plugin-focus-selector:tooltip", {
          mode: focusModeData.label,
        })}
      >
        <SelectTrigger variant="ghost" className="tw-w-fit tw-p-2">
          <SelectValue>
            <div className="tw-flex tw-items-center tw-gap-2">
              <focusModeData.Icon className="tw-size-4" />
            </div>
          </SelectValue>
        </SelectTrigger>
      </Tooltip>
      <SelectContext>
        {({ open, setOpen }) => {
          return isMobile ? (
            <MobileSelectContent
              open={open}
              onOpenChange={({ open }) => setOpen(open)}
            />
          ) : (
            <DesktopSelectContent />
          );
        }}
      </SelectContext>
    </Select>
  );
}
