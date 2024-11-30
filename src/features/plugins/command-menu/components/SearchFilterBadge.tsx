import { Badge } from "@/components/ui/badge";
import { SEARCH_FILTERS } from "@/features/plugins/command-menu/items";
import { useCommandMenuStore } from "@/features/plugins/command-menu/store";

export default function SearchFilterBadge() {
  const { filter } = useCommandMenuStore();

  if (!filter) return null;

  return (
    <div className="tw-ml-3">
      <Badge>{SEARCH_FILTERS[filter].label}</Badge>
    </div>
  );
}
