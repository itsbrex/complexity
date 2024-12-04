import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { LuChevronRight, LuChevronLeft, LuLoader2 } from "react-icons/lu";

import ChangelogRenderer from "@/components/ChangelogRenderer";
import { Button } from "@/components/ui/button";
import { useVersionPagination } from "@/features/options-page/dashboard/pages/release-notes/hooks/useVersionPagination";
import { cplxApiQueries } from "@/services/cplx-api/query-keys";

export default function ReleaseNotesPage() {
  const { data: versions } = useQuery({
    ...cplxApiQueries.versions,
  });

  const { currentVersion, hasNext, hasPrev, goToNext, goToPrev } =
    useVersionPagination(versions);

  const {
    data: changelog,
    isLoading,
    isPlaceholderData,
  } = useQuery({
    ...cplxApiQueries.changelog({
      version: currentVersion,
    }),
    enabled: !!currentVersion,
    placeholderData: keepPreviousData,
  });

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <div className="tw-flex tw-flex-col tw-gap-2">
        <h1 className="tw-text-2xl tw-font-bold">Release Notes</h1>
        <p className="tw-text-sm tw-text-muted-foreground">
          Stay up to date with the latest changes and features.
        </p>
      </div>
      <div className="tw-flex tw-items-center tw-gap-4">
        {hasPrev && (
          <Button variant="outline" size="sm" onClick={goToPrev}>
            <LuChevronLeft className="tw-size-4" />
          </Button>
        )}
        <div className="tw-text-2xl tw-font-semibold">{currentVersion}</div>
        {hasNext && (
          <Button variant="outline" size="sm" onClick={goToNext}>
            <LuChevronRight className="tw-size-4" />
          </Button>
        )}
      </div>
      <div
        className={cn(
          "tw-flex tw-max-w-screen-xl tw-flex-col tw-flex-wrap tw-gap-4",
          isPlaceholderData && "tw-opacity-50",
        )}
      >
        {isLoading && (
          <div className="tw-flex tw-items-center tw-gap-2">
            <LuLoader2 className="tw-size-4 tw-animate-spin" />
            <span>Loading...</span>
          </div>
        )}
        {changelog && <ChangelogRenderer changelog={changelog} />}
      </div>
    </div>
  );
}
