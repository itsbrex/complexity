import { useQuery } from "@tanstack/react-query";

import { pplxApiQueries } from "@/services/pplx-api/query-keys";

export default function usePplxAuth() {
  const query = useQuery(pplxApiQueries.auth);
  const isLoggedIn = query.data != null && Object.keys(query.data).length > 0;
  const orgStatusQuery = useQuery({
    ...pplxApiQueries.auth._ctx.orgStatus,
    enabled: isLoggedIn,
    staleTime: 60 * 1000,
  });
  const isOrgMember = orgStatusQuery.data?.is_in_organization ?? false;

  return {
    ...query,
    orgStatusQuery,
    isLoggedIn,
    isOrgMember,
  };
}
