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

type DeleteLanguageOptionButtonProps = {
  deleteMutation: () => void;
};

export function DeleteLanguageOptionButton({
  deleteMutation,
}: DeleteLanguageOptionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={({ open }) => setIsOpen(open)}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <LuTrash2 />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t(
              "dashboard-plugins-page:pluginDetails.betterCodeBlocks.languageOptions.delete.title",
            )}
          </DialogTitle>
          <DialogDescription>
            {t(
              "dashboard-plugins-page:pluginDetails.betterCodeBlocks.languageOptions.delete.description",
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            {t("action.cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              deleteMutation();
              setIsOpen(false);
            }}
          >
            {t("action.delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
