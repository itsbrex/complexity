import { useQuery } from "@tanstack/react-query";
import { useCommandState } from "cmdk";
import { LuLink } from "react-icons/lu";
import { sendMessage } from "webext-bridge/content-script";

import { CommandItem } from "@/components/ui/command";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSpaRouter } from "@/features/plugins/_core/spa-router/listeners";
import SpaceItemFile from "@/features/plugins/query-box/space-navigator/SpaceItemFile";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { Space } from "@/services/pplx-api/pplx-api.types";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import { emojiCodeToString, parseUrl } from "@/utils/utils";

export default function SpaceItem({ space }: { space: Space }) {
  const { isMobile } = useIsMobileStore();

  const url = useSpaRouter((state) => state.url);

  const spaceSlugFromUrl = parseUrl(url).pathname.split("/").pop();

  const isOnSpacePage =
    spaceSlugFromUrl === space.slug || spaceSlugFromUrl === space.uuid;

  const ref = useRef<HTMLDivElement>(null);

  const isHighlighted: boolean = useCommandState(
    (state) => state.value === space.uuid,
  );

  const { data: files } = useQuery({
    ...pplxApiQueries.spaces._ctx.files(space.uuid),
    enabled: isHighlighted,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 30000,
  });

  // hacky fix for flashing hover card on popover open
  const [shouldEnableHoverCard, setShouldEnableHoverCard] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShouldEnableHoverCard(true);
    }, 100);
  }, []);

  const shouldShowHoverCard =
    (!isMobile && !!space.description) ||
    !!space.instructions ||
    (files?.num_total_files ?? 0) > 0;

  return (
    <CommandItem
      ref={ref}
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
        sendMessage(
          "spa-router:push",
          {
            url: `/collections/${space.slug}`,
          },
          "window",
        );
      }}
    >
      <HoverCard
        unmountOnExit
        lazyMount
        openDelay={0}
        closeDelay={0}
        positioning={{
          placement: "right",
          gutter: 25,
        }}
      >
        <HoverCardTrigger className="tw-flex tw-size-full tw-h-8 tw-items-center tw-justify-between tw-gap-4">
          <div className="tw-flex tw-items-center tw-gap-2">
            {space.emoji && <div>{emojiCodeToString(space.emoji)}</div>}
            {space.title}
          </div>
          {isOnSpacePage && (
            <div className="tw-text-xs tw-text-muted-foreground">
              {t(
                "plugin-space-navigator:spaceNavigator.spaceItem.currentLocation",
              )}
            </div>
          )}
        </HoverCardTrigger>
        {shouldEnableHoverCard && shouldShowHoverCard && (
          <HoverCardContent
            className="cplx-space-item-hover-card tw-hidden tw-p-0 md:tw-block"
            onClick={(e) => e.stopPropagation()}
          >
            <ScrollArea>
              <div className="tw-flex tw-max-h-[50vh] tw-max-w-[300px] tw-flex-col tw-gap-4 tw-p-4 xl:tw-max-w-[500px]">
                {space.description && (
                  <div className="tw-flex tw-flex-col tw-justify-between tw-gap-2">
                    <div className="tw-text-sm tw-font-medium tw-text-muted-foreground">
                      {t(
                        "plugin-space-navigator:spaceNavigator.spaceItem.details.description",
                      )}
                    </div>
                    <div className="tw-line-clamp-1 tw-whitespace-pre-wrap">
                      {space.description}
                    </div>
                  </div>
                )}
                {space.instructions && (
                  <div className="tw-flex tw-flex-col tw-justify-between tw-gap-2">
                    <div className="tw-text-sm tw-font-medium tw-text-muted-foreground">
                      {t(
                        "plugin-space-navigator:spaceNavigator.spaceItem.details.instructions",
                      )}
                    </div>
                    <ScrollArea className="tw-whitespace-pre-wrap tw-rounded-md tw-bg-secondary">
                      <div className="tw-max-h-[200px] tw-p-2">
                        {space.instructions}
                      </div>
                    </ScrollArea>
                  </div>
                )}
                {space.focused_web_config?.link_configs.length > 0 && (
                  <div className="tw-flex tw-flex-col tw-justify-between tw-gap-2">
                    <div className="tw-truncate tw-text-sm tw-font-medium tw-text-muted-foreground">
                      {t(
                        "plugin-space-navigator:spaceNavigator.spaceItem.details.focusedWebLinks",
                        {
                          count: space.focused_web_config.link_configs.length,
                        },
                      )}
                    </div>
                    <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-2">
                      {space.focused_web_config.link_configs.map(
                        (link, idx) => (
                          <div
                            key={idx}
                            className="tw-flex tw-items-center tw-gap-2"
                          >
                            <LuLink className="tw-size-4" />
                            <div className="tw-line-clamp-1 tw-underline">
                              {link.link}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
                {files && files?.num_total_files > 0 && (
                  <div className="tw-flex tw-flex-col tw-justify-between tw-gap-2">
                    <div className="tw-text-sm tw-font-medium tw-text-muted-foreground">
                      {t(
                        "plugin-space-navigator:spaceNavigator.spaceItem.details.files",
                        {
                          count: files.num_total_files,
                        },
                      )}
                    </div>
                    {files.files.map((file, index) => (
                      <SpaceItemFile
                        key={index}
                        file={file}
                        spaceUuid={space.uuid}
                      />
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </HoverCardContent>
        )}
      </HoverCard>
    </CommandItem>
  );
}
