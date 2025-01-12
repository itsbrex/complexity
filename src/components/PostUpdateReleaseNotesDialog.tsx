import { useQuery } from "@tanstack/react-query";

import { APP_CONFIG } from "@/app.config";
import ChangelogRenderer from "@/components/ChangelogRenderer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cplxApiQueries } from "@/services/cplx-api/query-keys";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";

export function PostUpdateReleaseNotesDialog() {
  const settings = ExtensionLocalStorageService.getCachedSync();

  const shouldFetchChangelog =
    settings.previousVersion != null &&
    settings.previousVersion !== APP_CONFIG.VERSION;

  const {
    data: changelog,
    isLoading,
    isError,
  } = useQuery({
    ...cplxApiQueries.changelog({
      version: APP_CONFIG.VERSION,
    }),
    enabled: shouldFetchChangelog,
  });

  useEffect(() => {
    if (settings.previousVersion == null || isError) {
      ExtensionLocalStorageService.set((draft) => {
        draft.previousVersion = APP_CONFIG.VERSION;
      });
    }
  }, [settings.previousVersion, isError]);

  if (
    settings.previousVersion == null ||
    settings.previousVersion === APP_CONFIG.VERSION
  ) {
    return null;
  }

  if (!shouldFetchChangelog || isLoading || isError || !changelog) return null;

  return (
    <Dialog
      defaultOpen
      onExitComplete={() => {
        ExtensionLocalStorageService.set((draft) => {
          draft.previousVersion = APP_CONFIG.VERSION;
        });
      }}
    >
      <DialogContent className="tw-w-max tw-max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>Updated to v{APP_CONFIG.VERSION}</DialogTitle>
        </DialogHeader>
        <ChangelogRenderer changelog={changelog} />
        <DialogFooter>
          <DialogClose asChild>
            <Button>Dismiss</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
