import { DialogProps } from "@/components/ui/dialog";
import { SelectItem } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { RECENCIES } from "@/data/plugins/better-focus-selector/focus-web-recency";

export function MobileSelectContent({ ...props }: DialogProps) {
  return (
    <Sheet lazyMount unmountOnExit {...props}>
      <SheetContent side="bottom" className="x-flex x-flex-col x-gap-2">
        {RECENCIES.map((recency) => (
          <SelectItem
            key={recency.value}
            checkboxOnSingleItem
            item={recency.value}
            className="x-flex x-items-center x-gap-2 x-py-3 x-font-medium"
          >
            <span className="x-grow-1">{recency.label}</span>
          </SelectItem>
        ))}
      </SheetContent>
    </Sheet>
  );
}
