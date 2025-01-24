import { createListCollection, SelectContext } from "@ark-ui/react";
import { sendMessage } from "webext-bridge/content-script";

import Tooltip from "@/components/Tooltip";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FocusMode,
  FOCUS_MODES,
} from "@/data/plugins/better-focus-selector/focus-modes";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { useInsertCss } from "@/hooks/useInsertCss";
import { useSharedQueryBoxStore } from "@/plugins/_core/ui-groups/query-box/shared-store";
import { DesktopSelectContent } from "@/plugins/better-focus-selector/components/DesktopSelectContent";
import { MobileSelectContent } from "@/plugins/better-focus-selector/components/MobileSelectContent";
import hideNativeFocusSelectorCss from "@/plugins/better-focus-selector/hide-native-focus-selector.css?inline";
import { TEST_ID_SELECTORS } from "@/utils/dom-selectors";
import { UiUtils } from "@/utils/ui-utils";

export default function FocusSelectorWrapper() {
  useInsertCss({
    id: "hide-native-focus-selector",
    css: hideNativeFocusSelectorCss,
  });

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

  useEffect(() => {
    sendMessage(
      "reactVdom:setFocusMode",
      {
        focusMode: selectedFocusMode,
      },
      "window",
    );
  }, [selectedFocusMode]);

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
      className="tw-h-8"
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
        content={t("plugin-focus-selector:focusSelector.tooltip", {
          mode: focusModeData.label,
        })}
      >
        <SelectTrigger variant="ghost" className="tw-h-full tw-w-fit tw-px-2">
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
