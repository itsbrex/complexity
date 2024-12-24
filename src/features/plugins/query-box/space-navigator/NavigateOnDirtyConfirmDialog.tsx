import { useImperativeHandle } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type NavigateOnDirtyConfirmDialogProps = {
  ref: React.RefObject<{
    open: () => void;
  } | null>;
  onConfirm: () => void;
};

export function NavigateOnDirtyConfirmDialog({
  ref,
  onConfirm,
}: NavigateOnDirtyConfirmDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
  }));

  return (
    <Dialog
      lazyMount
      unmountOnExit
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unsaved Prompt</DialogTitle>
          <DialogDescription>
            Are you sure you want to navigate away? Your prompt will be lost if
            you haven&apos;t enabled &quot;Prompt History&quot; plugin.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={() => {
              onConfirm();
              setIsOpen(false);
            }}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
