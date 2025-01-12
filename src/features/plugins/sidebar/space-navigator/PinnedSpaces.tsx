import { useQuery } from "@tanstack/react-query";
import { LuPinOff } from "react-icons/lu";
import { sendMessage } from "webext-bridge/content-script";

import Tooltip from "@/components/Tooltip";
import { useSpaceNavigatorSidebarStore } from "@/features/plugins/sidebar/space-navigator/store";
import { useUnpinSpaceMutation } from "@/features/plugins/sidebar/space-navigator/use-pinned-spaces-mutations";
import { pinnedSpacesQueries } from "@/services/indexed-db/pinned-spaces/query-keys";
import { emojiCodeToString } from "@/utils/utils";

export default function SidebarPinnedSpaces() {
  const { isShown } = useSpaceNavigatorSidebarStore();

  const { data: pinnedSpaces } = useQuery({
    ...pinnedSpacesQueries.list,
    enabled: isShown,
  });

  const { mutate: unpinSpace } = useUnpinSpaceMutation();

  if (!isShown || !pinnedSpaces || pinnedSpaces.length === 0) return null;

  return (
    <div className="custom-scrollbar tw-max-h-[200px] tw-overflow-y-auto">
      <div
        className={cn(
          "tw-mt-1 tw-flex tw-flex-col tw-gap-1 tw-px-2 tw-text-xs tw-font-medium tw-text-muted-foreground",
          {
            "tw-ml-[29px] tw-border-l tw-border-border":
              pinnedSpaces.length > 0,
          },
        )}
      >
        {pinnedSpaces.length > 0 &&
          pinnedSpaces.map((space, index) => (
            <div
              key={index}
              className="tw-group tw-flex tw-cursor-pointer tw-items-center tw-justify-between tw-rounded-md tw-px-1 tw-py-1 tw-transition-all hover:tw-bg-white/5"
              onClick={() => {
                sendMessage(
                  "spa-router:push",
                  {
                    url: `/collections/${space.slug}`,
                  },
                  "window",
                );
              }}
            >
              <div className="tw-line-clamp-1 tw-flex tw-flex-1 tw-items-center tw-gap-1">
                {space.emoji && <span>{emojiCodeToString(space.emoji)}</span>}
                <span>{space.title}</span>
              </div>
              <Tooltip content="Unpin">
                <div
                  className="tw-hidden tw-transition-all hover:tw-text-foreground active:tw-scale-95 group-hover:tw-block"
                  onClick={(e) => {
                    e.stopPropagation();
                    unpinSpace({ uuid: space.uuid });
                  }}
                >
                  <LuPinOff />
                </div>
              </Tooltip>
            </div>
          ))}
      </div>
    </div>
  );
}
