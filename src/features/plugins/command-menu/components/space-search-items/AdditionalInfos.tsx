import { useQuery } from "@tanstack/react-query";
import { LuFile } from "react-icons/lu";

import { Space } from "@/services/pplx-api/pplx-api.types";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";

type AdditionalInfosProps = {
  space: Space;
};

export function AdditionalInfos({ space }: AdditionalInfosProps) {
  const { data: files } = useQuery({
    ...pplxApiQueries.spaces._ctx.files(space.uuid),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return (
    <>
      {files && files.num_total_files > 0 && (
        <div className="tw-flex tw-flex-shrink-0 tw-items-center tw-gap-1 tw-rounded-md tw-border tw-border-border/50 tw-bg-secondary tw-px-2 tw-py-1 tw-text-xs tw-text-muted-foreground tw-animate-in tw-fade-in">
          <span>{files.num_total_files}</span>
          <LuFile className="!tw-size-3" />
        </div>
      )}
    </>
  );
}
