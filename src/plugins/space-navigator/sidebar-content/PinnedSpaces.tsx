import { DragEndEvent } from "@dnd-kit/core";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocalStorage } from "@uidotdev/usehooks";
import { LuPinOff } from "react-icons/lu";
import { sendMessage } from "webext-bridge/content-script";

import SwappableDndProvider from "@/components/dnd/SwappableDndProvider";
import SwappableSortableItem from "@/components/dnd/SwappableSortableItem";
import Tooltip from "@/components/Tooltip";
import { PinnedSpace } from "@/data/plugins/space-navigator/pinned-space.types";
import { useUnpinSpaceMutation } from "@/plugins/space-navigator/sidebar-content/use-pinned-spaces-mutations";
import { getPinnedSpacesService } from "@/services/indexed-db/pinned-spaces";
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
      href={`/collections/${space.slug}`}
      className={cn(
        "x-group x-flex x-cursor-pointer x-select-none x-items-center x-justify-between x-rounded-md x-px-1 x-py-1 x-transition-colors x-duration-300",
        isDragging && "x-opacity-75",
        !isDragging &&
          !isAnyDragging &&
          "hover:x-bg-black/5 dark:hover:x-bg-white/5",
      )}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey) return;

        e.preventDefault();
        e.stopPropagation();

        sendMessage(
          "spa-router:push",
          {
            url: `/collections/${space.slug}`,
          },
          "window",
        );
      }}
    >
      <div className="x-line-clamp-1">
        {space.emoji && (
          <span className="x-mr-1">{emojiCodeToString(space.emoji)}</span>
        )}
        <span>{space.title}</span>
      </div>
      <Tooltip
        content={t("plugin-space-navigator:spaceNavigator.pinnedSpaces.unpin")}
      >
        <div
          className={cn("x-hidden active:x-scale-95", {
            "hover:x-text-foreground group-hover:x-block":
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
  const [isCollapsed] = useLocalStorage("cplx.pinned-spaces-collapsed", false);

  const [localPinnedSpaces, setLocalPinnedSpaces] = useState<PinnedSpace[]>([]);

  const { data: spaces, isLoading: isSpacesLoading } = useQuery(
    pplxApiQueries.spaces,
  );

  const { data: pinnedSpaces = [] } = useQuery({
    ...pinnedSpacesQueries.list,
    enabled: !isCollapsed,
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

  if (isCollapsed || localPinnedSpaces.length === 0) return null;

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
    <div className="custom-scrollbar x-max-h-[200px] x-overflow-y-auto">
      <div
        className={cn(
          "x-mt-1 x-flex x-flex-col x-gap-1 x-px-2 x-text-xs x-font-medium x-text-muted-foreground",
          {
            "x-ml-[29px] x-border-l x-border-border/50 dark:x-border-border":
              localPinnedSpaces.length > 0,
          },
        )}
      >
        {isSpacesLoading ? (
          <>
            <div className="x-my-2 x-h-[6px] x-w-4/5 x-animate-pulse x-rounded-full x-bg-black/5 dark:x-bg-white/5" />
            <div className="x-my-2 x-h-[6px] x-w-1/3 x-animate-pulse x-rounded-full x-bg-black/5 dark:x-bg-white/5" />
            <div className="x-my-2 x-h-[6px] x-w-1/2 x-animate-pulse x-rounded-full x-bg-black/5 dark:x-bg-white/5" />
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
