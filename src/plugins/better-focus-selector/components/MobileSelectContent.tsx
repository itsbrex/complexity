import { DialogProps } from "@/components/ui/dialog";
import { SelectItem } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { FOCUS_MODES } from "@/data/plugins/better-focus-selector/focus-modes";

export function MobileSelectContent({ ...props }: DialogProps) {
  return (
    <Sheet lazyMount unmountOnExit {...props}>
      <SheetContent side="bottom" className="x-flex x-flex-col x-gap-2">
        {FOCUS_MODES.map((mode) => (
          <SelectItem
            key={mode.code}
            item={mode.code}
            className="x-flex x-flex-col x-items-start x-gap-2 x-py-3 x-font-medium x-text-foreground"
          >
            <div className="x-flex x-items-center x-gap-3">
              <mode.Icon className="x-size-5" />
              <div>{mode.label}</div>
            </div>
            <div className="x-text-sm x-text-muted-foreground">
              {mode.description}
            </div>
          </SelectItem>
        ))}
      </SheetContent>
    </Sheet>
  );
}
