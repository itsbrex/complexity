import { DragEndEvent } from "@dnd-kit/core";
import { useQuery, useMutation } from "@tanstack/react-query";
import { LuPinOff } from "react-icons/lu";
import { sendMessage } from "webext-bridge/content-script";

import SwappableDndProvider from "@/components/dnd/SwappableDndProvider";
import SwappableSortableItem from "@/components/dnd/SwappableSortableItem";
import Tooltip from "@/components/Tooltip";
import { PinnedSpace } from "@/data/plugins/space-navigator/pinned-space.types";
import { useSpaceNavigatorSidebarStore } from "@/features/plugins/sidebar/space-navigator/store";
import { useUnpinSpaceMutation } from "@/features/plugins/sidebar/space-navigator/use-pinned-spaces-mutations";
import { getPinnedSpacesService } from "@/services/indexed-db/pinned-spaces/pinned-spaces";
import { pinnedSpacesQueries } from "@/services/indexed-db/pinned-spaces/query-keys";
import { queryClient } from "@/utils/ts-query-client";
import { emojiCodeToString } from "@/utils/utils";

type PinnedSpaceContentProps = {
  emoji: string | null | undefined;
  title: string;
  uuid: string;
  isDragging: boolean;
  isAnyDragging: boolean;
};

function PinnedSpaceContent({
  emoji,
  title,
  uuid,
  isDragging,
  isAnyDragging,
}: PinnedSpaceContentProps) {
  const { mutate: unpinSpace } = useUnpinSpaceMutation();

  return (
    <div
      className={cn(
        "tw-group tw-flex tw-cursor-pointer tw-items-center tw-justify-between tw-rounded-md tw-px-1 tw-py-1 tw-transition-all tw-duration-300",
        isDragging && "tw-opacity-75",
        !isDragging && !isAnyDragging && "hover:tw-bg-white/5",
      )}
      onClick={() => {
        sendMessage(
          "spa-router:push",
          {
            url: `/collections/${uuid}`,
          },
          "window",
        );
      }}
    >
      <div className="tw-line-clamp-1 tw-flex tw-flex-1 tw-items-center tw-gap-1">
        {emoji && <span>{emojiCodeToString(emoji)}</span>}
        <span>{title}</span>
      </div>
      <Tooltip
        content={t("plugin-space-navigator:spaceNavigator.pinnedSpaces.unpin")}
      >
        <div
          className={cn("tw-hidden tw-transition-all active:tw-scale-95", {
            "tw-animate-in tw-fade-in hover:tw-text-foreground group-hover:tw-block":
              !isDragging && !isAnyDragging,
          })}
          onClick={(e) => {
            e.stopPropagation();
            unpinSpace({ uuid });
          }}
        >
          <LuPinOff />
        </div>
      </Tooltip>
    </div>
  );
}

export default function SidebarPinnedSpaces() {
  const { isShown } = useSpaceNavigatorSidebarStore();
  const [localPinnedSpaces, setLocalPinnedSpaces] = useState<PinnedSpace[]>([]);

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
        (space) => space.slug === active.id,
      );
      const overSpace = localPinnedSpaces.find(
        (space) => space.slug === over.id,
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
            "tw-ml-[29px] tw-border-l tw-border-border":
              localPinnedSpaces.length > 0,
          },
        )}
      >
        <SwappableDndProvider
          items={localPinnedSpaces.map((item) => item.slug)}
          onDragEnd={handleDragEnd}
        >
          {localPinnedSpaces.map((space) => (
            <SwappableSortableItem key={space.slug} id={space.slug}>
              {({ isDragging, isAnyDragging }) => (
                <PinnedSpaceContent
                  emoji={space.emoji}
                  title={space.title}
                  uuid={space.uuid}
                  isDragging={isDragging}
                  isAnyDragging={isAnyDragging}
                />
              )}
            </SwappableSortableItem>
          ))}
        </SwappableDndProvider>
      </div>
    </div>
  );
}
