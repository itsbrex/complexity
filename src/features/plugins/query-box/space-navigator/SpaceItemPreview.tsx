import { useQuery } from "@tanstack/react-query";
import { useCommandState } from "cmdk";
import { LuLink } from "react-icons/lu";

import { ScrollArea } from "@/components/ui/scroll-area";
import SpaceItemFile from "@/features/plugins/query-box/space-navigator/SpaceItemFile";
import { Space } from "@/services/pplx-api/pplx-api.types";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";

export default function SpaceItemPreview({ spaces }: { spaces: Space[] }) {
  const space: Space | undefined = useCommandState((state) => {
    const selectedSpaceUuid = state.value;
    return spaces?.find((space) => space.uuid === selectedSpaceUuid);
  });

  const isHighlighted: boolean = useCommandState(
    (state) => state.value === space?.uuid,
  );

  const { data: files } = useQuery({
    ...pplxApiQueries.spaces._ctx.files(space?.uuid ?? ""),
    enabled: space != null && isHighlighted,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 30000,
  });

  if (space == null) return null;

  const isEmptyView =
    !space.description &&
    !space.instructions &&
    (files?.num_total_files ?? 0) <= 0;

  if (isEmptyView)
    return (
      <div className="tw-flex tw-size-full tw-items-center tw-justify-center tw-text-muted-foreground">
        No preview data available
      </div>
    );

  return (
    <div className="tw-flex tw-flex-col tw-gap-4 tw-p-4">
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
            <div className="tw-max-h-[200px] tw-p-2">{space.instructions}</div>
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
            {space.focused_web_config.link_configs.map((link, idx) => (
              <div key={idx} className="tw-flex tw-items-center tw-gap-2">
                <LuLink className="tw-size-4" />
                <div className="tw-line-clamp-1 tw-underline">{link.link}</div>
              </div>
            ))}
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
            <SpaceItemFile key={index} file={file} spaceUuid={space.uuid} />
          ))}
        </div>
      )}
    </div>
  );
}
