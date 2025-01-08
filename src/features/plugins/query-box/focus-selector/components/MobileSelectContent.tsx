import { DialogProps } from "@/components/ui/dialog";
import { SelectItem } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { FOCUS_MODES } from "@/data/plugins/focus-selector/focus-modes";

export function MobileSelectContent({ ...props }: DialogProps) {
  return (
    <Sheet lazyMount unmountOnExit {...props}>
      <SheetContent side="bottom" className="tw-flex tw-flex-col tw-gap-2">
        {FOCUS_MODES.map((mode) => (
          <SelectItem
            key={mode.code}
            item={mode.code}
            className="tw-flex tw-flex-col tw-items-start tw-gap-2 tw-py-3 tw-text-foreground"
          >
            <div className="tw-flex tw-items-center tw-gap-3">
              <mode.Icon className="tw-size-5" />
              <div>{mode.label}</div>
            </div>
            <div className="tw-text-sm tw-text-muted-foreground">
              {mode.description}
            </div>
          </SelectItem>
        ))}
      </SheetContent>
    </Sheet>
  );
}
