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
        className="x-flex x-min-h-8 x-w-max x-cursor-pointer x-items-center x-justify-between x-gap-1 x-rounded-md x-px-2 x-text-center x-text-sm x-font-medium x-text-muted-foreground x-outline-none x-transition-all x-duration-150 placeholder:x-text-muted-foreground hover:x-bg-primary-foreground hover:x-text-foreground focus-visible:x-bg-primary-foreground focus-visible:x-outline-none active:x-scale-95 disabled:x-cursor-not-allowed disabled:x-opacity-50 [&>span]:!x-truncate"
        data-testid={TEST_ID_SELECTORS.QUERY_BOX.SPACE_NAVIGATOR}
      >
        <PplxSpace className="x-size-4" />
        {spaceName && <div className="x-hidden md:x-block">{spaceName}</div>}
      </button>
    </SpaceNavigatorMobileContentWrapper>
  );
}
