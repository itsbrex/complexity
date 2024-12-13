import { useQuery } from "@tanstack/react-query";

import { useSpaRouter } from "@/features/plugins/_core/spa-router/listeners";
import SpaceNaviagorDesktopWrapper from "@/features/plugins/query-box/space-navigator/DesktopWrapper";
import SpaceNavigatorMobileWrapper from "@/features/plugins/query-box/space-navigator/MobileWrapper";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { useCookies } from "@/hooks/useCookies";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import { parseUrl } from "@/utils/utils";

export default function SpaceNavigator() {
  const {
    data: spaces,
    isFetching,
    isLoading,
  } = useQuery(pplxApiQueries.spaces);

  const url = useSpaRouter((state) => state.url);
  const spaceSlugFromUrl = parseUrl(url).pathname.split("/").pop();
  const spaceNameFromUrl = spaces?.find(
    (space) =>
      space.slug === spaceSlugFromUrl || space.uuid === spaceSlugFromUrl,
  )?.title;

  const { isMobile } = useIsMobileStore();

  const sharedProps = {
    spaces,
    isLoading,
    isFetching,
    spaceNameFromUrl,
  };

  const isIncognito =
    useCookies().find((cookie) => cookie.name === "pplx.is-incognito")
      ?.value === "true";

  if (isIncognito) return null;

  return isMobile ? (
    <SpaceNavigatorMobileWrapper {...sharedProps} />
  ) : (
    <SpaceNaviagorDesktopWrapper {...sharedProps} />
  );
}
