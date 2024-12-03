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
        <Button variant="outline">
          {t(
            "dashboard-settings-page:settingsPage.items.reset.dialog.buttons.clearButton",
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("dashboard-settings-page:settingsPage.items.reset.dialog.title")}
          </DialogTitle>
        </DialogHeader>
        <div>
          {t(
            "dashboard-settings-page:settingsPage.items.reset.dialog.description",
          )}
          <Ul>
            <li>
              {t(
                "dashboard-settings-page:settingsPage.items.reset.dialog.items.settings",
              )}
            </li>
            <li>
              {t(
                "dashboard-settings-page:settingsPage.items.reset.dialog.items.customData",
              )}
            </li>
            <li>
              {t(
                "dashboard-settings-page:settingsPage.items.reset.dialog.items.otherData",
              )}
            </li>
          </Ul>
        </div>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button variant="outline">{t("action.cancel")}</Button>
          </DialogTrigger>
          <AsyncButton variant="destructive" onClick={handleClearData}>
            {t(
              "dashboard-settings-page:settingsPage.items.reset.dialog.buttons.confirm",
            )}
          </AsyncButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
