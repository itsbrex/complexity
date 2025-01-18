import { DragEndEvent } from "@dnd-kit/core";
import { useQuery, useMutation } from "@tanstack/react-query";
import { LuPinOff } from "react-icons/lu";
import { sendMessage } from "webext-bridge/content-script";

import SwappableDndProvider from "@/components/dnd/SwappableDndProvider";
import SwappableSortableItem from "@/components/dnd/SwappableSortableItem";
import Tooltip from "@/components/Tooltip";
import { PinnedSpace } from "@/data/plugins/space-navigator/pinned-space.types";
import { useSpaceNavigatorSidebarStore } from "@/features/plugins/space-navigator/sidebar-content/store";
import { useUnpinSpaceMutation } from "@/features/plugins/space-navigator/sidebar-content/use-pinned-spaces-mutations";
import { getPinnedSpacesService } from "@/services/indexed-db/pinned-spaces/pinned-spaces";
import { pinnedSpacesQueries } from "@/services/indexed-db/pinned-spaces/query-keys";
import { Space } from "@/services/pplx-api/pplx-api.types";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import { queryClient } from "@/utils/ts-query-client";
import { emojiCodeToString } from "@/utils/utils";

type PinnedSpaceContentProps = {
  uuid: string;
  isDragging: boolean;
  isAnyDragging: boolean;
  spaces: Space[];
};

function PinnedSpaceContent({
  uuid,
  isDragging,
  isAnyDragging,
  spaces,
}: PinnedSpaceContentProps) {
  const space = spaces?.find((space) => space.uuid === uuid);

  const { mutate: unpinSpace } = useUnpinSpaceMutation();

  if (space == null) return null;

  return (
    <a
      href={`/collections/${uuid}`}
      className={cn(
        "tw-group tw-flex tw-cursor-pointer tw-select-none tw-items-center tw-justify-between tw-rounded-md tw-px-1 tw-py-1 tw-transition-colors tw-duration-300",
        isDragging && "tw-opacity-75",
        !isDragging &&
          !isAnyDragging &&
          "hover:tw-bg-black/5 dark:hover:tw-bg-white/5",
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        sendMessage(
          "spa-router:push",
          {
            url: `/collections/${uuid}`,
          },
          "window",
        );
      }}
    >
      <div className="tw-line-clamp-1">
        {space.emoji && (
          <span className="tw-mr-1">{emojiCodeToString(space.emoji)}</span>
        )}
        <span>{space.title}</span>
      </div>
      <Tooltip
        content={t("plugin-space-navigator:spaceNavigator.pinnedSpaces.unpin")}
      >
        <div
          className={cn("tw-hidden active:tw-scale-95", {
            "hover:tw-text-foreground group-hover:tw-block":
              !isDragging && !isAnyDragging,
          })}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            unpinSpace({ uuid });
          }}
        >
          <LuPinOff />
        </div>
      </Tooltip>
    </a>
  );
}

export default function SidebarPinnedSpaces() {
  const { isShown } = useSpaceNavigatorSidebarStore();
  const [localPinnedSpaces, setLocalPinnedSpaces] = useState<PinnedSpace[]>([]);

  const { data: spaces, isLoading: isSpacesLoading } = useQuery(
    pplxApiQueries.spaces,
  );

  const { data: pinnedSpaces = [] } = useQuery({
    ...pinnedSpacesQueries.list,
    enabled: isShown,
  });

  useEffect(() => {
    setLocalPinnedSpaces(pinnedSpaces);
  }, [pinnedSpaces]);

  const { mutate: swapSpaces } = useMutation({
    mutationFn: ({
      from,
      to,
    }: {
      from: PinnedSpace["uuid"];
      to: PinnedSpace["uuid"];
    }) => getPinnedSpacesService().swap({ from, to }),
    onMutate: async ({ from, to }) => {
      await queryClient.cancelQueries({
        queryKey: pinnedSpacesQueries.list.queryKey,
      });

      const fromIndex = localPinnedSpaces.findIndex(
        (space) => space.uuid === from,
      );
      const toIndex = localPinnedSpaces.findIndex((space) => space.uuid === to);

      if (fromIndex === -1 || toIndex === -1) return;

      const newOrder = [...localPinnedSpaces];

      if (!newOrder[fromIndex] || !newOrder[toIndex]) return;

      [newOrder[fromIndex], newOrder[toIndex]] = [
        newOrder[toIndex],
        newOrder[fromIndex],
      ];

      setLocalPinnedSpaces(newOrder);
      queryClient.setQueryData(pinnedSpacesQueries.list.queryKey, newOrder);

      return { previousSpaces: localPinnedSpaces };
    },
    onError: (err, newSpaces, context) => {
      setLocalPinnedSpaces(context?.previousSpaces ?? pinnedSpaces);
      queryClient.setQueryData(
        pinnedSpacesQueries.list.queryKey,
        context?.previousSpaces ?? pinnedSpaces,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: pinnedSpacesQueries.list.queryKey,
      });
    },
  });

  if (!isShown || localPinnedSpaces.length === 0) return null;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeSpace = localPinnedSpaces.find(
        (space) => space.uuid === active.id,
      );
      const overSpace = localPinnedSpaces.find(
        (space) => space.uuid === over.id,
      );

      if (!activeSpace || !overSpace) return;

      swapSpaces({
        from: activeSpace.uuid,
        to: overSpace.uuid,
      });
    }
  }

  return (
    <div className="custom-scrollbar tw-max-h-[200px] tw-overflow-y-auto">
      <div
        className={cn(
          "tw-mt-1 tw-flex tw-flex-col tw-gap-1 tw-px-2 tw-text-xs tw-font-medium tw-text-muted-foreground",
          {
            "tw-ml-[29px] tw-border-l tw-border-border/50 dark:tw-border-border":
              localPinnedSpaces.length > 0,
          },
        )}
      >
        {isSpacesLoading ? (
          <>
            <div className="tw-my-2 tw-h-[6px] tw-w-4/5 tw-animate-pulse tw-rounded-full tw-bg-black/5 dark:tw-bg-white/5" />
            <div className="tw-my-2 tw-h-[6px] tw-w-1/3 tw-animate-pulse tw-rounded-full tw-bg-black/5 dark:tw-bg-white/5" />
            <div className="tw-my-2 tw-h-[6px] tw-w-1/2 tw-animate-pulse tw-rounded-full tw-bg-black/5 dark:tw-bg-white/5" />
          </>
        ) : (
          <SwappableDndProvider
            items={localPinnedSpaces.map((item) => item.uuid)}
            onDragEnd={handleDragEnd}
          >
            {localPinnedSpaces.map((space, index) => (
              <SwappableSortableItem key={index} id={space.uuid}>
                {({ isDragging, isAnyDragging }) => (
                  <PinnedSpaceContent
                    spaces={spaces ?? []}
                    uuid={space.uuid}
                    isDragging={isDragging}
                    isAnyDragging={isAnyDragging}
                  />
                )}
              </SwappableSortableItem>
            ))}
          </SwappableDndProvider>
        )}
      </div>
    </div>
  );
}
