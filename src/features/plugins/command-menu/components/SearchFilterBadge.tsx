import { Badge } from "@/components/ui/badge";
import { SEARCH_FILTERS } from "@/features/plugins/command-menu/items";
import { useCommandMenuStore } from "@/features/plugins/command-menu/store";

export default function SearchFilterBadge() {
  const { filter, spacethreadTitle } = useCommandMenuStore();

  if (!filter) return null;

  return (
    <div className="tw-ml-3">
      {SEARCH_FILTERS[filter].label && (
        <Badge>{SEARCH_FILTERS[filter].label}</Badge>
      )}
      {filter === "spaces-threads" && (
        <Badge className="tw-line-clamp-1 tw-max-w-[150px]">
          {spacethreadTitle}
        </Badge>
      )}
    </div>
  );
}
