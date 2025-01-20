import { useQuery } from "@tanstack/react-query";

import { APP_CONFIG } from "@/app.config";
import { cplxApiQueries } from "@/services/cplx-api/query-keys";
import { ExtensionVersion } from "@/utils/ext-version";

export default function useExtensionUpdate() {
  const { data: versions } = useQuery({
    ...cplxApiQueries.versions,
    staleTime: 1000,
  });

  const isUpdateAvailable = useMemo(() => {
    if (!versions) return false;

    const currentVersion = APP_CONFIG.VERSION;
    const latestVersion = versions.latest;

    return new ExtensionVersion(latestVersion).isNewerThan(currentVersion);
  }, [versions]);

  return {
    isUpdateAvailable,
    latestVersion: versions?.latest,
  };
}
