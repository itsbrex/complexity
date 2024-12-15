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
          <DialogTitle>Import Data</DialogTitle>
          <DialogDescription>
            Current settings will be overridden or merged depending on the
            version of which the data is exported from
          </DialogDescription>
        </DialogHeader>
        <div className="tw-flex tw-flex-col tw-gap-4">
          <Textarea
            ref={ref}
            placeholder="Paste your data here..."
            className="tw-min-h-[200px] tw-font-mono"
          />
          <DialogClose asChild>
            <Button onClick={() => onSubmit(ref.current?.value ?? "")}>
              Submit
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
