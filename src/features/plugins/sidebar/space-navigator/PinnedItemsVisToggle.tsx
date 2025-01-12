import { useQuery } from "@tanstack/react-query";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { useSpaceNavigatorSidebarStore } from "@/features/plugins/sidebar/space-navigator/store";
import { pinnedSpacesQueries } from "@/services/indexed-db/pinned-spaces/query-keys";

export default function SidebarPinnedSpacesVisToggle() {
  const { isShown, setIsShown } = useSpaceNavigatorSidebarStore();

  const { data: pinnedSpaces } = useQuery({
    ...pinnedSpacesQueries.list,
    enabled: isShown,
  });

  if (!pinnedSpaces || pinnedSpaces.length === 0) return null;

  return (
    <Tooltip
      content={isShown ? "Collapse pinned Spaces" : "Expand pinned Spaces"}
    >
      <div
        className="tw-invisible tw-flex tw-size-6 tw-items-center tw-justify-center tw-text-muted-foreground tw-opacity-0 tw-transition-all hover:tw-bg-white/5 hover:tw-text-foreground group-hover:tw-visible group-hover:tw-opacity-100"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          setIsShown(!isShown);
        }}
      >
        {isShown ? <LuChevronUp /> : <LuChevronDown />}
      </div>
    </Tooltip>
  );
}
