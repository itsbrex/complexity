import { isHotkeyPressed } from "react-hotkeys-hook";
import { sendMessage } from "webext-bridge/content-script";

import { CommandItem } from "@/components/ui/command";
import { useCommandMenuStore } from "@/features/plugins/command-menu/store";
import { ThreadSearchApi } from "@/services/pplx-api/pplx-api.types";
import { formatHowLongAgo } from "@/utils/dayjs";

type SpaceThreadItemProps = {
  thread: ThreadSearchApi;
};

export default function SpaceThreadItem({ thread }: SpaceThreadItemProps) {
  const { setOpen } = useCommandMenuStore();

  const searchKeyword = useMemo(() => {
    return (thread.title + thread.first_answer)
      .replace(/\s+/g, "")
      .toLowerCase();
  }, [thread.title, thread.first_answer]);

  return (
    <CommandItem
      key={thread.uuid}
      asChild
      value={thread.uuid}
      keywords={[searchKeyword]}
      className="tw-flex tw-min-h-10 tw-justify-between tw-gap-4"
      onSelect={() => {
        if (isHotkeyPressed("ctrl")) {
          window.open(`/search/${thread.slug}`, "_blank");
        } else {
          sendMessage(
            "spa-router:push",
            {
              url: `/search/${thread.slug}`,
            },
            "window",
          );
          setOpen(false);
        }
      }}
    >
      <a
        href={`/search/${thread.slug}`}
        className="tw-flex tw-w-full tw-items-center tw-justify-between"
      >
        <div className="tw-flex-1">
          <div className="tw-line-clamp-1">{thread.title.slice(0, 100)}</div>
        </div>
        <div className="tw-flex tw-flex-shrink-0 tw-items-center tw-gap-2">
          <div className="tw-flex-shrink-0 tw-text-xs tw-text-muted-foreground">
            {formatHowLongAgo(thread.last_query_datetime)}
          </div>
        </div>
      </a>
    </CommandItem>
  );
}
