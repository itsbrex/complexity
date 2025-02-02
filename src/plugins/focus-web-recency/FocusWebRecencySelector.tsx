import { createListCollection, SelectContext } from "@ark-ui/react";
import { LuClock } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  RECENCIES,
  FocusWebRecency,
} from "@/data/plugins/better-focus-selector/focus-web-recency";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { DesktopSelectContent } from "@/plugins/focus-web-recency/components/DesktopSelectContent";
import { MobileSelectContent } from "@/plugins/focus-web-recency/components/MobileSelectContent";
import { UiUtils } from "@/utils/ui-utils";

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
      className="x-h-8"
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
        <SelectTrigger variant="ghost" className="x-h-full x-w-fit x-px-2">
          <SelectValue className="x-flex x-items-center x-gap-2">
            <LuClock className="x-size-4" />
            {recencyData.value !== "ALL" && (
              <span className="x-hidden md:x-inline">{recencyData.label}</span>
            )}
          </SelectValue>
        </SelectTrigger>
      </Tooltip>
      {isMobile ? (
        <SelectContext>
          {({ open, setOpen }) => (
            <MobileSelectContent
              open={open}
              onOpenChange={({ open }) => setOpen(open)}
            />
          )}
        </SelectContext>
      ) : (
        <DesktopSelectContent />
      )}
    </Select>
  );
}
