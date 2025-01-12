import { isHotkeyPressed } from "react-hotkeys-hook";
import { sendMessage } from "webext-bridge/content-script";

import { CommandItem } from "@/components/ui/command";
import { useCommandMenuStore } from "@/data/plugins/command-menu/store";
import { SpacePreview } from "@/features/plugins/command-menu/components/thread-search-items/SpacePreview";
import { ThreadSearchApi } from "@/services/pplx-api/pplx-api.types";
import { formatHowLongAgo } from "@/utils/dayjs";

type ThreadItemProps = {
  thread: ThreadSearchApi;
};

export function ThreadItem({ thread }: ThreadItemProps) {
  const { setOpen } = useCommandMenuStore();

  return (
    <CommandItem
      key={thread.slug}
      asChild
      value={thread.slug}
      className="tw-flex tw-h-10 tw-items-center tw-justify-between tw-gap-8 tw-font-medium"
      onSelect={() => {
        if (isHotkeyPressed("ctrl"))
          return window.open(`/search/${thread.slug}`, "_blank");

        sendMessage(
          "spa-router:push",
          {
            url: `/search/${thread.slug}`,
          },
          "window",
        );

        setOpen(false);
      }}
    >
      <a
        href={`/search/${thread.slug}`}
        className="tw-flex tw-w-full tw-items-center tw-justify-between"
      >
        <div className="tw-flex-1">
          <div className="tw-line-clamp-1" title={thread.title}>
            {thread.title.slice(0, 100)}
          </div>
        </div>
        <div className="tw-flex tw-flex-shrink-0 tw-items-center tw-gap-2">
          <SpacePreview thread={thread} />
          <div className="tw-flex-shrink-0 tw-text-xs tw-text-muted-foreground">
            {formatHowLongAgo(thread.last_query_datetime)}
          </div>
        </div>
      </a>
    </CommandItem>
  );
}
