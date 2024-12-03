import { LuTrash2 } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type DeleteButtonProps = {
  isDeleting: boolean;
  onDelete: () => void;
};

export function DeleteButton({ isDeleting, onDelete }: DeleteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog
      unmountOnExit
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
    >
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="icon">
          <LuTrash2 />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("dashboard-themes-page:themesPage.deleteDialog.title")}
          </DialogTitle>
          <DialogDescription>
            {t("dashboard-themes-page:themesPage.deleteDialog.description")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            {t("dashboard-themes-page:themesPage.deleteDialog.cancelButton")}
          </Button>
          <Button
            variant="destructive"
            disabled={isDeleting}
            onClick={onDelete}
          >
            {t("dashboard-themes-page:themesPage.deleteDialog.deleteButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
