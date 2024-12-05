import { APP_CONFIG } from "@/app.config";
import type { CplxVersionsApiResponse } from "@/services/cplx-api/cplx-api.types";
import { compareVersions } from "@/utils/utils";

export function useVersionPagination(
  versions: CplxVersionsApiResponse | undefined,
) {
  const [currentVersionIndex, setCurrentVersionIndex] = useState(0);

  const availableVersions = useMemo(() => {
    if (!versions?.changelogEntries) return [];
    return versions.changelogEntries.filter(
      (version) => compareVersions(APP_CONFIG.VERSION, version) >= 0,
    );
  }, [versions?.changelogEntries]);

  useEffect(() => {
    if (availableVersions.length > 0) {
      setCurrentVersionIndex(0);
    }
  }, [availableVersions]);

  const currentVersion = availableVersions[currentVersionIndex];
  const hasPrev = currentVersionIndex < availableVersions.length - 1;
  const hasNext = currentVersionIndex > 0;

  const goToNext = () => {
    if (hasNext) {
      setCurrentVersionIndex(currentVersionIndex - 1);
    }
  };

  const goToPrev = () => {
    if (hasPrev) {
      setCurrentVersionIndex(currentVersionIndex + 1);
    }
  };

  return {
    currentVersion,
    currentVersionIndex,
    hasNext,
    hasPrev,
    goToNext,
    goToPrev,
  };
}
