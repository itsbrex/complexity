import { APP_CONFIG } from "@/app.config";
import { CplxVersions } from "@/services/cplx-api/cplx-api.types";
import { ExtensionVersion } from "@/utils/ext-version";

export function useVersionPagination(versions: CplxVersions | undefined) {
  const [currentVersionIndex, setCurrentVersionIndex] = useState(0);

  const availableVersions = useMemo(() => {
    if (!versions?.changelogEntries) return [];
    return versions.changelogEntries.filter((version) =>
      new ExtensionVersion(APP_CONFIG.VERSION).isNewerThanOrEqualTo(version),
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
