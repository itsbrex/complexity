import { useQuery, UseQueryResult } from "@tanstack/react-query";

import usePplxAuth from "@/hooks/usePplxAuth";
import { PplxUserSettingsApiResponse } from "@/services/pplx-api/pplx-api.types";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import { ControlledQueryOptions } from "@/types/tanstack-query.types";

export default function usePplxUserSettings({
  ...props
}: ControlledQueryOptions<
  PplxUserSettingsApiResponse,
  typeof pplxApiQueries.userSettings.queryKey,
  "enabled"
> = {}): UseQueryResult<PplxUserSettingsApiResponse> {
  const { isLoggedIn } = usePplxAuth();

  const query = useQuery({
    ...pplxApiQueries.userSettings,
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
    enabled: isLoggedIn,
    ...props,
  });

  return query;
}
