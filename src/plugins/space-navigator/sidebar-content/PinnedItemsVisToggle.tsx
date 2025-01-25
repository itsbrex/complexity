import { useQuery } from "@tanstack/react-query";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { useSpaceNavigatorSidebarStore } from "@/plugins/space-navigator/sidebar-content/store";
import { getPinnedSpacesService } from "@/services/indexed-db/pinned-spaces/pinned-spaces";
import { pinnedSpacesQueries } from "@/services/indexed-db/pinned-spaces/query-keys";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";

export default function SidebarPinnedSpacesVisToggle() {
  const { isShown, setIsShown } = useSpaceNavigatorSidebarStore();

  const { data: pinnedSpaces } = useQuery({
    ...pinnedSpacesQueries.list,
    enabled: isShown,
  });

  useCleanUpNonExistingPinnedSpaces();

  if (!pinnedSpaces || pinnedSpaces.length === 0) return null;

  return (
    <Tooltip
      content={
        isShown
          ? t(
              "plugin-space-navigator:spaceNavigator.pinnedSpaces.toggleVisibility.collapse",
            )
          : t(
              "plugin-space-navigator:spaceNavigator.pinnedSpaces.toggleVisibility.expand",
            )
      }
    >
      <div
        className="x-invisible x-flex x-size-6 x-items-center x-justify-center x-text-muted-foreground x-opacity-0 x-transition-all hover:x-bg-black/5 hover:x-text-foreground group-hover:x-visible group-hover:x-opacity-100 dark:hover:x-bg-white/5"
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

function useCleanUpNonExistingPinnedSpaces() {
  const { data: spaces, isSuccess: isSpacesFetchSuccess } = useQuery(
    pplxApiQueries.spaces,
  );

  const { data: pinnedSpaces, isSuccess: isPinnedSpacesFetchSuccess } =
    useQuery(pinnedSpacesQueries.list);

  useEffect(() => {
    if (!isSpacesFetchSuccess || !isPinnedSpacesFetchSuccess) return;

    pinnedSpaces.forEach((pinnedSpace) => {
      if (!spaces.some((space) => space.uuid === pinnedSpace.uuid)) {
        getPinnedSpacesService().delete(pinnedSpace.uuid);
      }
    });
  }, [isSpacesFetchSuccess, isPinnedSpacesFetchSuccess, spaces, pinnedSpaces]);
}
