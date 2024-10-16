import { useQuery } from "@tanstack/react-query";

import { extensionPermissionsQueries } from "@/services/extension-permissions/query-keys";

export function useExtensionPermissions() {
  const query = useQuery(extensionPermissionsQueries.permissions);

  return query;
}
