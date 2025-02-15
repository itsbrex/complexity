import { PopoverRootProvider, usePopover } from "@ark-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useCommandState } from "cmdk";
import { LuLink } from "react-icons/lu";
import { sendMessage } from "webext-bridge/content-script";

import { CommandItem } from "@/components/ui/command";
import { PopoverContent } from "@/components/ui/popover";
import { useSpaRouter } from "@/features/plugins/_core/spa-router/listeners";
import { NavigateOnDirtyConfirmDialog } from "@/features/plugins/query-box/space-navigator/NavigateOnDirtyConfirmDialog";
import SpaceItemFile from "@/features/plugins/query-box/space-navigator/SpaceItemFile";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { Space } from "@/services/pplx-api/pplx-api.types";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import UiUtils from "@/utils/UiUtils";
import { emojiCodeToString, parseUrl } from "@/utils/utils";

export default function SpaceItem({ space }: { space: Space }) {
  const { isMobile } = useIsMobileStore();

  const url = useSpaRouter((state) => state.url);

  const spaceSlugFromUrl = parseUrl(url).pathname.split("/").pop();

  const isOnSpacePage =
    spaceSlugFromUrl === space.slug || spaceSlugFromUrl === space.uuid;

  const [popoverOpen, setPopoverOpen] = useState(false);

  const navigateOnDirtyConfirmDialogRef = useRef<{
    open: () => void;
  }>(null);

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

  const popover = usePopover({
    open: popoverOpen,
    onOpenChange: ({ open }) => setPopoverOpen(open),
    positioning: {
      placement: "right-start",
      offset: {
        mainAxis: 20,
      },
      getAnchorRect: () => ref.current?.getBoundingClientRect() ?? null,
    },
    autoFocus: false,
    portalled: false,
  });

  const shouldShowPopover =
    (!isMobile && !!space.description) ||
    !!space.instructions ||
    (files?.num_total_files ?? 0) > 0;

  useEffect(() => {
    setPopoverOpen(isHighlighted);
  }, [isHighlighted]);

  return (
    <>
      <CommandItem
        ref={ref}
        key={space.uuid}
        className={cn(
          "tw-relative tw-flex tw-min-h-10 tw-items-center tw-justify-between tw-gap-4 tw-text-sm",
          {
            "tw-text-primary": isOnSpacePage,
          },
        )}
        value={space.uuid}
        keywords={[
          space.title,
          space.description?.slice(0, 100),
          space.instructions?.slice(0, 100),
        ]}
        onSelect={() => {
          const activeQueryBoxText =
            UiUtils.getActiveQueryBoxTextarea()[0].value;

          if (activeQueryBoxText) {
            navigateOnDirtyConfirmDialogRef.current?.open();
            return;
          }

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
        {isOnSpacePage && (
          <div className="tw-text-xs tw-text-muted-foreground">
            {t(
              "plugin-space-navigator:spaceNavigator.spaceItem.currentLocation",
            )}
          </div>
        )}
      </CommandItem>
      {shouldShowPopover === true && (
        <PopoverRootProvider unmountOnExit lazyMount value={popover}>
          <PopoverContent className="tw-hidden tw-max-w-[300px] tw-p-4 md:tw-block xl:tw-max-w-[500px]">
            <div className="tw-flex tw-flex-col tw-gap-4 tw-overflow-auto">
              {space.description && (
                <div className="tw-flex tw-flex-col tw-justify-between tw-gap-2">
                  <div className="tw-text-sm tw-text-muted-foreground">
                    {t(
                      "plugin-space-navigator:spaceNavigator.spaceItem.details.description",
                    )}
                  </div>
                  <div className="tw-line-clamp-1">{space.description}</div>
                </div>
              )}
              {space.instructions && (
                <div className="tw-flex tw-flex-col tw-justify-between tw-gap-2">
                  <div className="tw-text-sm tw-text-muted-foreground">
                    {t(
                      "plugin-space-navigator:spaceNavigator.spaceItem.details.instructions",
                    )}
                  </div>
                  <div className="tw-max-h-[200px] tw-overflow-auto tw-rounded-md tw-bg-secondary tw-p-2">
                    {space.instructions}
                  </div>
                </div>
              )}
              {space.focused_web_config?.link_configs.length > 0 && (
                <div className="tw-flex tw-flex-col tw-justify-between tw-gap-2">
                  <div className="tw-truncate tw-text-sm tw-text-muted-foreground">
                    {t(
                      "plugin-space-navigator:spaceNavigator.spaceItem.details.focusedWebLinks",
                      {
                        count: space.focused_web_config.link_configs.length,
                      },
                    )}
                  </div>
                  <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-2">
                    {space.focused_web_config.link_configs.map((link, idx) => (
                      <div
                        key={idx}
                        className="tw-flex tw-items-center tw-gap-2"
                      >
                        <LuLink className="tw-size-4" />
                        <div className="tw-line-clamp-1 tw-underline">
                          {link.link}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {files && files?.num_total_files > 0 && (
                <div className="tw-flex tw-flex-col tw-justify-between tw-gap-2">
                  <div className="tw-text-sm tw-text-muted-foreground">
                    {t(
                      "plugin-space-navigator:spaceNavigator.spaceItem.details.files",
                      {
                        count: files.num_total_files,
                      },
                    )}
                  </div>
                  {files.files.map((file) => (
                    <SpaceItemFile
                      key={file.file_uuid}
                      file={file}
                      spaceUuid={space.uuid}
                    />
                  ))}
                </div>
              )}
            </div>
          </PopoverContent>
        </PopoverRootProvider>
      )}
      <NavigateOnDirtyConfirmDialog
        ref={navigateOnDirtyConfirmDialogRef}
        onConfirm={() => {
          sendMessage(
            "spa-router:push",
            {
              url: `/collections/${space.slug}`,
            },
            "window",
          );
        }}
      />
    </>
  );
}
