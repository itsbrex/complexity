import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "react-router-dom";

import ChangelogRenderer from "@/components/ChangelogRenderer";
import LoadingOverlay from "@/components/LoadingOverlay";
import { H1, H2 } from "@/components/ui/typography";
import { cplxApiQueries } from "@/services/cplx-api/query-keys";

export default function DirectReleaseNotesPage() {
  const { version } = useLoaderData() as { version: string };

  const {
    data: changelog,
    isLoading,
    isError,
  } = useQuery({
    ...cplxApiQueries.changelog({
      version: version,
    }),
  });

  if (isLoading) return <LoadingOverlay />;

  return (
    <div className="tw-m-8 tw-flex tw-max-w-[90vw] tw-flex-col tw-gap-4 xl:tw-mx-auto xl:tw-min-h-screen">
      <H1>Release Notes</H1>
      <H2 className="tw-w-max tw-rounded-md tw-border tw-border-border/50 tw-bg-secondary tw-px-4 tw-py-2 tw-font-mono tw-text-primary">
        v{version}
      </H2>
      {changelog && <ChangelogRenderer changelog={changelog} />}
      {(!changelog || isError) && (
        <div className="tw-flex tw-flex-col tw-gap-2">
          <p>No changelog found for this version</p>
          <p className="tw-text-sm tw-text-muted-foreground">
            This version may not have any changelog.
          </p>
        </div>
      )}
    </div>
  );
}
