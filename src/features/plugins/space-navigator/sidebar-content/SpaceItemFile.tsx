import { FaFile } from "react-icons/fa";

import {
  Space,
  SpaceFilesApiResponse,
} from "@/services/pplx-api/pplx-api.types";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import { queryClient } from "@/utils/ts-query-client";

export default function SpaceItemFiles({
  file,
  spaceUuid,
}: {
  file: SpaceFilesApiResponse["files"][number];
  spaceUuid: Space["uuid"];
}) {
  return (
    <div className="tw-flex tw-items-center tw-space-x-2">
      <FaFile className="tw-inline-block tw-size-4" />
      <span
        className="tw-line-clamp-1 tw-cursor-pointer hover:tw-underline"
        onClick={async () => {
          const fileDownloadUrl = await queryClient.fetchQuery(
            pplxApiQueries.spaces._ctx
              .files(spaceUuid)
              ._ctx.downloadUrl(file.file_uuid),
          );

          if (fileDownloadUrl?.file_url) {
            window.open(fileDownloadUrl.file_url, "_blank");
          }
        }}
      >
        {file.filename}
      </span>
    </div>
  );
}
