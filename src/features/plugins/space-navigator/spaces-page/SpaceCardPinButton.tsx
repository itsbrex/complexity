import { useQuery } from "@tanstack/react-query";
import { LuPin, LuPinOff } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import {
  usePinSpaceMutation,
  useUnpinSpaceMutation,
} from "@/features/plugins/space-navigator/sidebar-content/use-pinned-spaces-mutations";
import { pinnedSpacesQueries } from "@/services/indexed-db/pinned-spaces/query-keys";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";

export default function SpaceCardPinButton({
  htmlNode,
}: {
  htmlNode: HTMLElement;
}) {
  const slug = useMemo(() => {
    return $(htmlNode).attr("href")?.split("/").pop();
  }, [htmlNode]);

  const { data: spaces } = useQuery(pplxApiQueries.spaces);

  const { data: pinnedSpaces } = useQuery(pinnedSpacesQueries.list);

  const space = spaces?.find((space) => space.slug === slug);

  const isPinned = pinnedSpaces?.some(
    (pinnedSpace) => pinnedSpace.uuid === space?.uuid,
  );

  const { mutate: pinSpace } = usePinSpaceMutation();

  const { mutate: unpinSpace } = useUnpinSpaceMutation();

  if (space == null) return null;

  return (
    <div
      className="tw-absolute tw-bottom-2 tw-right-2 tw-animate-in tw-fade-in"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isPinned) {
          unpinSpace({ uuid: space.uuid });
        } else {
          pinSpace({ uuid: space.uuid });
        }
      }}
    >
      <Tooltip content={isPinned ? "Unpin from sidebar" : "Pin to sidebar"}>
        <div className="tw-m-1 tw-rounded-md tw-p-1 tw-text-muted-foreground tw-transition-all hover:tw-bg-muted hover:tw-text-foreground active:tw-scale-95">
          {isPinned ? <LuPinOff /> : <LuPin />}
        </div>
      </Tooltip>
    </div>
  );
}
