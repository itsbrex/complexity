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
      <DialogContent className="x-max-h-[80vh] x-overflow-y-auto">
        <DialogHeader className="x-text-lg x-font-semibold">
          A new version of the extension is available!
        </DialogHeader>
        <DialogDescription>
          Please update to receive enhancements and bug fixes.
        </DialogDescription>
        <div className="x-flex x-flex-col x-gap-2">
          <div className="x-mx-auto x-my-0 x-flex x-items-center x-gap-2 x-rounded-md x-border x-border-border/50 x-bg-secondary x-p-4">
            <div className="">{packageJson.version}</div>
            <LuArrowRight className="x-size-4 x-text-muted-foreground" />
            <div className="x-text-xl x-font-semibold x-text-primary">
              {latestVersion}
            </div>
          </div>

          <div
            className="x-mx-auto x-cursor-pointer x-text-muted-foreground hover:x-text-foreground hover:x-underline"
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

          <div className="x-space-y-2">
            <div>
              <LuInfo className="x-mr-2 x-inline-block x-size-5 x-text-primary" />
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
              <div className="x-w-full">
                <Image
                  src={
                    APP_CONFIG.BROWSER === "chrome"
                      ? "https://i.imgur.com/IMLecmp.png"
                      : "https://i.imgur.com/f2x3Mtl.png"
                  }
                  alt="extension-management-page"
                  className="x-my-4 x-object-cover"
                />
              </div>
            </div>
            <div className="x-text-muted-foreground">
              Or click{" "}
              <a
                className="x-underline"
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
      className="x-inline-block x-cursor-pointer x-text-primary x-underline"
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
