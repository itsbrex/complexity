import { useQuery } from "@tanstack/react-query";
import { Trans } from "react-i18next";
import { LuInfo, LuLoader2 } from "react-icons/lu";

import { APP_CONFIG } from "@/app.config";
import ChangelogRenderer from "@/components/ChangelogRenderer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cplxApiQueries } from "@/services/cplx-api/query-keys";

export default function ExtensionUpdateInfoDialogWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: versions } = useQuery({
    ...cplxApiQueries.versions,
  });

  const latestVersion = versions?.latest;

  const { data: changelog, isLoading } = useQuery({
    ...cplxApiQueries.changelog({
      version: latestVersion,
    }),
    enabled: !!latestVersion,
  });

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="tw-max-h-[80vh] tw-overflow-y-auto">
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
        <div className="tw-flex tw-flex-col tw-gap-2">
          {isLoading && (
            <div className="tw-flex tw-items-center tw-gap-2">
              <LuLoader2 className="tw-size-4 tw-animate-spin" />
              <span>Fetching changelog...</span>
            </div>
          )}
          {changelog && <ChangelogRenderer changelog={changelog} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
