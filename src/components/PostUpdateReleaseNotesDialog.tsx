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
  DialogTrigger,
} from "@/components/ui/dialog";
import { cplxApiQueries } from "@/services/cplx-api/query-keys";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";

export function PostUpdateReleaseNotesDialog() {
  const [open, setOpen] = useState(true);

  const {
    data: changelog,
    isLoading,
    isError,
  } = useQuery(
    cplxApiQueries.changelog({
      version: APP_CONFIG.VERSION,
    }),
  );

  useEffect(() => {
    if (isError) {
      ExtensionLocalStorageService.set((draft) => {
        draft.showPostUpdateReleaseNotesPopup = false;
      });
    }
  }, [isError]);

  if (isLoading || isError || !changelog) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={({ open }) => setOpen(open)}
      onExitComplete={() => {
        ExtensionLocalStorageService.set((draft) => {
          draft.showPostUpdateReleaseNotesPopup = false;
        });
      }}
    >
      <DialogContent className="tw-w-max tw-max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>
            {t("common:releaseNotes.title", { version: APP_CONFIG.VERSION })}
          </DialogTitle>
        </DialogHeader>
        <ChangelogRenderer changelog={changelog} />
        <DialogFooter>
          <DontShowAgainForFutureUpdatesConfirmDialog
            onConfirm={() => {
              ExtensionLocalStorageService.set((draft) => {
                draft.showPostUpdateReleaseNotesPopup = false;
              });
              setOpen(false);
            }}
          >
            <Button variant="outline">
              {t("common:releaseNotes.dontShowAgain")}
            </Button>
          </DontShowAgainForFutureUpdatesConfirmDialog>
          <DialogClose asChild>
            <Button>{t("common:releaseNotes.dismiss")}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DontShowAgainForFutureUpdatesConfirmDialog({
  children,
  onConfirm,
}: {
  children: React.ReactNode;
  onConfirm: () => void;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent portal={false}>
        <DialogHeader>
          <DialogTitle>
            {t("common:releaseNotes.confirmDialog.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="tw-text-sm tw-text-muted-foreground">
          {t("common:releaseNotes.confirmDialog.message")}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">
              {t("common:releaseNotes.confirmDialog.cancel")}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={onConfirm}>
              {t("common:releaseNotes.confirmDialog.confirm")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
