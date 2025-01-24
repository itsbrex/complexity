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
          className="tw-w-[150px] tw-overflow-hidden tw-p-2 tw-font-medium"
        >
          <span className="tw-grow-1 tw-line-clamp-1">{recency.label}</span>
        </SelectItem>
      ))}
    </SelectContent>
  );
}
