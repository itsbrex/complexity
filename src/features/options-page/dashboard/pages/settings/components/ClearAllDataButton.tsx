import { useNavigate } from "react-router-dom";

import AsyncButton from "@/components/AsyncButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Ul } from "@/components/ui/typography";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { db } from "@/services/indexed-db/indexed-db";

export default function ClearAllDataButton() {
  const navigate = useNavigate();

  const handleClearData = async () => {
    await ExtensionLocalStorageService.clearAll();
    await db.clearAll();
    navigate("/plugins");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Clear All Data</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clear All Data</DialogTitle>
        </DialogHeader>
        <div>
          Are you sure you want to clear all extension data? This action cannot
          be undone and will wipe the following data:
          <Ul>
            <li>Extension settings</li>
            <li>All custom themes, code blocks rules, etc.</li>
            <li>And any other data stored by the extension</li>
          </Ul>
        </div>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogTrigger>
          <AsyncButton variant="destructive" onClick={handleClearData}>
            Yes, Clear All Data
          </AsyncButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
