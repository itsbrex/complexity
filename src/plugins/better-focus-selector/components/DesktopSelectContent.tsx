import { SelectContent, SelectItem } from "@/components/ui/select";
import { FOCUS_MODES } from "@/data/plugins/better-focus-selector/focus-modes";

export function DesktopSelectContent() {
  return (
    <SelectContent className="x-max-h-[45dvh]">
      {FOCUS_MODES.map((mode) => (
        <SelectItem
          key={mode.code}
          item={mode.code}
          className="x-flex x-flex-col x-items-start x-gap-1 x-font-medium x-text-foreground"
        >
          <div className="x-flex x-items-center x-gap-2">
            <mode.Icon className="x-size-4" />
            <div>{mode.label}</div>
          </div>
          <div className="x-text-xs x-text-muted-foreground">
            {mode.description}
          </div>
        </SelectItem>
      ))}
    </SelectContent>
  );
}
