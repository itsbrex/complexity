import { useQuery } from "@tanstack/react-query";

import { pplxApiQueries } from "@/services/pplx-api/query-keys";

export default function usePplxAuth() {
  const query = useQuery(pplxApiQueries.auth);

  const isLoggedIn = query.data != null && Object.keys(query.data).length > 0;

  return {
    ...query,
    isLoggedIn,
  };
}
