import { SelectContent, SelectItem } from "@/components/ui/select";
import { FOCUS_MODES } from "@/data/plugins/focus-selector/focus-modes";

export function DesktopSelectContent() {
  return (
    <SelectContent className="tw-max-h-[45dvh]">
      {FOCUS_MODES.map((mode) => (
        <SelectItem
          key={mode.code}
          item={mode.code}
          className="tw-flex tw-flex-col tw-items-start tw-gap-1"
        >
          <div className="tw-flex tw-items-center tw-gap-2">
            <mode.Icon className="tw-size-4" />
            <div>{mode.label}</div>
          </div>
          <div className="tw-text-xs tw-text-muted-foreground">
            {mode.description}
          </div>
        </SelectItem>
      ))}
    </SelectContent>
  );
}
