import { SelectContent, SelectItem } from "@/components/ui/select";
import { RECENCIES } from "@/data/plugins/better-focus-selector/focus-web-recency";

export function DesktopSelectContent() {
  return (
    <SelectContent>
      {RECENCIES.map((recency) => (
        <SelectItem
          key={recency.value}
          checkboxOnSingleItem
          item={recency.value}
          className="x-w-[150px] x-overflow-hidden x-p-2 x-font-medium"
        >
          <span className="x-grow-1 x-line-clamp-1">{recency.label}</span>
        </SelectItem>
      ))}
    </SelectContent>
  );
}
