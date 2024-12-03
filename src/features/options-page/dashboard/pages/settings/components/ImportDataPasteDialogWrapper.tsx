import { useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function ImportDataPasteDialogWrapper({
  children,
  onSubmit,
}: {
  children: React.ReactNode;
  onSubmit: (data: string) => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  return (
    <Dialog closeOnEscape={false} closeOnInteractOutside={false}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t(
              "dashboard-settings-page:settingsPage.items.import.dialog.title",
            )}
          </DialogTitle>
          <DialogDescription>
            {t(
              "dashboard-settings-page:settingsPage.items.import.dialog.description",
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="tw-flex tw-flex-col tw-gap-4">
          <Textarea
            ref={ref}
            placeholder={t(
              "dashboard-settings-page:settingsPage.items.import.dialog.placeholder",
            )}
            className="tw-min-h-[200px] tw-font-mono"
          />
          <DialogClose asChild>
            <Button onClick={() => onSubmit(ref.current?.value ?? "")}>
              {t(
                "dashboard-settings-page:settingsPage.items.import.dialog.submit",
              )}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
