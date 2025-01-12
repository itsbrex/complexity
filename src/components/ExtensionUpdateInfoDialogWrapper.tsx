import { useQuery } from "@tanstack/react-query";
import { LuArrowRight, LuInfo } from "react-icons/lu";
import { sendMessage } from "webext-bridge/content-script";

import { APP_CONFIG } from "@/app.config";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Image } from "@/components/ui/image";
import { toast } from "@/components/ui/use-toast";
import { cplxApiQueries } from "@/services/cplx-api/query-keys";
import packageJson from "~/package.json";

export default function ExtensionUpdateInfoDialogWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: versions } = useQuery({
    ...cplxApiQueries.versions,
  });

  const latestVersion = versions?.latest;

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="tw-max-h-[80vh] tw-overflow-y-auto">
        <DialogHeader className="tw-text-lg tw-font-semibold">
          A new version of the extension is available!
        </DialogHeader>
        <DialogDescription>
          Please update to receive enhancements and bug fixes.
        </DialogDescription>
        <div className="tw-flex tw-flex-col tw-gap-2">
          <div className="tw-mx-auto tw-my-0 tw-flex tw-items-center tw-gap-2 tw-rounded-md tw-border tw-border-border/50 tw-bg-secondary tw-p-4">
            <div className="">{packageJson.version}</div>
            <LuArrowRight className="tw-size-4 tw-text-muted-foreground" />
            <div className="tw-text-xl tw-font-semibold tw-text-primary">
              {latestVersion}
            </div>
          </div>

          <div
            className="tw-mx-auto tw-cursor-pointer tw-text-muted-foreground hover:tw-text-foreground hover:tw-underline"
            role="link"
            onClick={() => {
              if (!latestVersion) return;

              sendMessage(
                "bg:openDirectReleaseNotes",
                {
                  version: latestVersion,
                },
                "background",
              );
            }}
          >
            Release Notes
          </div>

          <div className="tw-space-y-2">
            <div>
              <LuInfo className="tw-mr-2 tw-inline-block tw-size-5 tw-text-primary" />
              <span>
                The upgrade should be happening automatically when you restart
                the browser, or force it to manually update in the{" "}
                <ExtensionManagementPageLink />
                {APP_CONFIG.BROWSER === "firefox" ? (
                  <span> =&gt; Complexity</span>
                ) : (
                  "."
                )}
              </span>
              <div className="tw-w-full">
                <Image
                  src={
                    APP_CONFIG.BROWSER === "chrome"
                      ? "https://i.imgur.com/IMLecmp.png"
                      : "https://i.imgur.com/f2x3Mtl.png"
                  }
                  alt="extension-management-page"
                  className="tw-my-4 tw-object-cover"
                />
              </div>
            </div>
            <div className="tw-text-muted-foreground">
              Or click{" "}
              <a
                className="tw-underline"
                href={
                  APP_CONFIG.BROWSER === "chrome"
                    ? "https://chromewebstore.google.com/detail/complexity-perplexity-ai/ffppmilmeaekegkpckebkeahjgmhggpj"
                    : "https://addons.mozilla.org/en-US/firefox/addon/complexity/"
                }
                target="_blank"
                rel="noreferrer"
              >
                HERE
              </a>{" "}
              to revisit the store and manually reinstall the extension if none
              of the above works (remember to export your settings!).
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ExtensionManagementPageLink() {
  return (
    <div
      role="link"
      className="tw-inline-block tw-cursor-pointer tw-text-primary tw-underline"
      onClick={() => {
        if (APP_CONFIG.BROWSER === "chrome") {
          navigator.clipboard.writeText("chrome://extensions");
        } else {
          navigator.clipboard.writeText("about:addons");
        }
        toast({
          title: "✅ Link copied to clipboard",
          description: "Please manually open the copied link.",
        });
      }}
    >
      {APP_CONFIG.BROWSER === "chrome" ? "chrome://extensions" : "about:addons"}
    </div>
  );
}
