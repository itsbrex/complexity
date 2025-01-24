import { sendMessage } from "webext-bridge/content-script";

import { CommandItem } from "@/components/ui/command";
import { useSpaRouter } from "@/plugins/_api/spa-router/listeners";
import { Space } from "@/services/pplx-api/pplx-api.types";
import { emojiCodeToString, parseUrl } from "@/utils/utils";

export default function SpaceItem({
  space,
  setOpen,
}: {
  space: Space;
  setOpen: (open: boolean) => void;
}) {
  const url = useSpaRouter((state) => state.url);

  const spaceSlugFromUrl = parseUrl(url).pathname.split("/").pop();

  const isOnSpacePage =
    spaceSlugFromUrl === space.slug || spaceSlugFromUrl === space.uuid;

  return (
    <CommandItem
      key={space.uuid}
      className={cn("tw-relative tw-min-h-10 tw-text-sm tw-font-medium", {
        "tw-text-primary": isOnSpacePage,
      })}
      value={space.uuid}
      keywords={[
        space.title,
        space.description?.slice(0, 100),
        space.instructions?.slice(0, 100),
      ]}
      onSelect={() => {
        setOpen(false);

        sendMessage(
          "spa-router:push",
          {
            url: `/collections/${space.slug}`,
          },
          "window",
        );
      }}
    >
      <div className="tw-flex tw-items-center tw-gap-2">
        {space.emoji && <div>{emojiCodeToString(space.emoji)}</div>}
        {space.title}
      </div>
      <div className="tw-ml-2 tw-flex tw-items-center tw-gap-1">
        {isOnSpacePage && (
          <div className="tw-text-xs tw-text-muted-foreground">
            {t(
              "plugin-space-navigator:spaceNavigator.spaceItem.currentLocation",
            )}
          </div>
        )}
      </div>
    </CommandItem>
  );
}
