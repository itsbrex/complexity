import { useQuery } from "@tanstack/react-query";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { useSpaceNavigatorSidebarStore } from "@/features/plugins/sidebar/space-navigator/store";
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
