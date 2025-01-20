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
  } = useQuery({
    ...cplxApiQueries.changelog({
      version: APP_CONFIG.VERSION,
    }),
  });

  useEffect(() => {
    if (isError) {
      ExtensionLocalStorageService.set((draft) => {
        draft.shouldShowPostUpdateReleaseNotes = false;
      });
    }
  }, [isError]);

  if (isLoading || isError || !changelog) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={({ open }) => setOpen(open)}
      onExitComplete={() => {
        setTimeout(() => {
          ExtensionLocalStorageService.set((draft) => {
            draft.shouldShowPostUpdateReleaseNotes = false;
          });
        }, 0);
      }}
    >
      <DialogContent className="tw-w-max tw-max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>Updated to v{APP_CONFIG.VERSION}</DialogTitle>
        </DialogHeader>
        <ChangelogRenderer changelog={changelog} />
        <DialogFooter>
          <DontShowAgainForFutureUpdatesConfirmDialog
            onConfirm={() => {
              ExtensionLocalStorageService.set((draft) => {
                draft.doNotShowPostUpdateReleaseNotesPopup = true;
              });
              setOpen(false);
            }}
          >
            <Button variant="outline">
              Dismiss and don&apos;t show again for future updates
            </Button>
          </DontShowAgainForFutureUpdatesConfirmDialog>
          <DialogClose asChild>
            <Button>Dismiss</Button>
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
          <DialogTitle>Confirm</DialogTitle>
        </DialogHeader>

        <div className="tw-text-sm tw-text-muted-foreground">
          Are you sure you want to dismiss and not show again for future
          updates? You can always re-enable this popup in the settings page.
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={onConfirm}>I understand</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
