import { DialogProps } from "@/components/ui/dialog";
import { SelectItem } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { RECENCIES } from "@/data/plugins/better-focus-selector/focus-web-recency";

export function MobileSelectContent({ ...props }: DialogProps) {
  return (
    <Sheet lazyMount unmountOnExit {...props}>
      <SheetContent side="bottom" className="tw-flex tw-flex-col tw-gap-2">
        {RECENCIES.map((recency) => (
          <SelectItem
            key={recency.value}
            checkboxOnSingleItem
            item={recency.value}
            className="tw-flex tw-items-center tw-gap-2 tw-py-3 tw-font-medium"
          >
            <span className="tw-grow-1">{recency.label}</span>
          </SelectItem>
        ))}
      </SheetContent>
    </Sheet>
  );
}
