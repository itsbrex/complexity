import { useQuery } from "@tanstack/react-query";

import { APP_CONFIG } from "@/app.config";
import { cplxApiQueries } from "@/services/cplx-api/query-keys";
import { compareVersions } from "@/utils/utils";

export default function useExtensionUpdate() {
  const { data: versions } = useQuery(cplxApiQueries.versions);

  const isUpdateAvailable = useMemo(() => {
    if (!versions) return false;

    const currentVersion = APP_CONFIG.VERSION;
    const latestVersion = versions.latest;

    return compareVersions(latestVersion, currentVersion) > 0;
  }, [versions]);

  return {
    isUpdateAvailable,
    latestVersion: versions?.latest,
  };
}
