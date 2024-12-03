import { Trans } from "react-i18next";
import { LuInfo } from "react-icons/lu";

import { APP_CONFIG } from "@/app.config";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ExtensionUpdateInfoDialogWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="tw-text-lg tw-font-semibold">
          {t("common:sidebar.updateAnnouncer.newVersion")}
        </DialogHeader>
        <DialogDescription>
          {t("common:sidebar.updateAnnouncer.updatePrompt")}
        </DialogDescription>
        <div className="tw-flex tw-flex-col tw-gap-2 tw-rounded-md tw-border tw-border-border/50 tw-bg-secondary tw-p-4">
          <div className="tw-space-y-2">
            <div>
              <LuInfo className="tw-mr-2 tw-inline-block tw-size-5 tw-text-primary" />
              <span>{t("common:sidebar.updateAnnouncer.autoUpdateInfo")}</span>
            </div>
            <div className="tw-text-muted-foreground">
              <Trans
                i18nKey="common:sidebar.updateAnnouncer.manualUpdateInfo"
                components={{
                  storeLink: (
                    <a
                      className="tw-underline"
                      href={
                        APP_CONFIG.BROWSER === "chrome"
                          ? "https://chromewebstore.google.com/detail/complexity-perplexity-ai/ffppmilmeaekegkpckebkeahjgmhggpj"
                          : "https://addons.mozilla.org/en-US/firefox/addon/complexity/"
                      }
                      target="_blank"
                      rel="noreferrer"
                    />
                  ),
                }}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
