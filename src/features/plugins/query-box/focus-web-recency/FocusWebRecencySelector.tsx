import { createListCollection, SelectContext } from "@ark-ui/react";
import { LuClock } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  RECENCIES,
  FocusWebRecency,
} from "@/data/plugins/focus-selector/focus-web-recency";
import { DesktopSelectContent } from "@/features/plugins/query-box/focus-web-recency/components/DesktopSelectContent";
import { MobileSelectContent } from "@/features/plugins/query-box/focus-web-recency/components/MobileSelectContent";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import UiUtils from "@/utils/UiUtils";

export default function FocusWebRecencySelector({
  value,
  setValue,
  recencyData,
}: {
  value: FocusWebRecency["value"];
  setValue: (value: FocusWebRecency["value"]) => void;
  recencyData: FocusWebRecency;
}) {
  const { isMobile } = useIsMobileStore();

  return (
    <Select
      lazyMount
      unmountOnExit
      portal={false}
      collection={createListCollection({
        items: RECENCIES,
        itemToString: (item) => item.label,
        itemToValue: (item) => item.value,
      })}
      value={[value]}
      className="tw-h-8"
      onValueChange={({ value }) => {
        setValue(value[0] as FocusWebRecency["value"]);

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
        content={t("plugin-focus-selector:focusWebRecencySelector.tooltip", {
          mode: recencyData.label,
        })}
      >
        <SelectTrigger variant="ghost" className="tw-h-full tw-w-fit tw-px-2">
          <SelectValue className="tw-flex tw-items-center tw-gap-1">
            <LuClock className="tw-size-4" />
            {recencyData.value !== "ALL" && (
              <span className="tw-hidden md:tw-inline">
                {recencyData.label}
              </span>
            )}
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
