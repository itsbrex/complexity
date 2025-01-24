import { useQuery } from "@tanstack/react-query";

import PplxSpace from "@/components/icons/PplxSpace";
import { useSpaRouter } from "@/plugins/_api/spa-router/listeners";
import SpaceNavigatorMobileContentWrapper from "@/plugins/space-navigator/query-box/ContentWrapper";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import { TEST_ID_SELECTORS } from "@/utils/dom-selectors";
import { parseUrl } from "@/utils/utils";

export default function SpaceNavigatorWrapper() {
  const { data: spaces } = useQuery(pplxApiQueries.spaces);

  const url = useSpaRouter((state) => state.url);
  const spaceSlug = parseUrl(url).pathname.split("/").pop();
  const spaceName = spaces?.find(
    (space) => space.slug === spaceSlug || space.uuid === spaceSlug,
  )?.title;

  return (
    <SpaceNavigatorMobileContentWrapper>
      <button
        className="tw-flex tw-min-h-8 tw-w-max tw-cursor-pointer tw-items-center tw-justify-between tw-gap-1 tw-rounded-md tw-px-2 tw-text-center tw-text-sm tw-font-medium tw-text-muted-foreground tw-outline-none tw-transition-all tw-duration-150 placeholder:tw-text-muted-foreground hover:tw-bg-primary-foreground hover:tw-text-foreground focus-visible:tw-bg-primary-foreground focus-visible:tw-outline-none active:tw-scale-95 disabled:tw-cursor-not-allowed disabled:tw-opacity-50 [&>span]:!tw-truncate"
        data-testid={TEST_ID_SELECTORS.QUERY_BOX.SPACE_NAVIGATOR}
      >
        <PplxSpace className="tw-size-4" />
        {spaceName && <div className="tw-hidden md:tw-block">{spaceName}</div>}
      </button>
    </SpaceNavigatorMobileContentWrapper>
  );
}
