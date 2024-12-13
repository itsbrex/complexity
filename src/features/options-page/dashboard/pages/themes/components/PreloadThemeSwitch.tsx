import { LuHelpCircle } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { InlineCode } from "@/components/ui/typography";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";
import { useExtensionPermissions } from "@/services/extension-permissions/useExtensionPermissions";

export default function PreloadThemeSwitch() {
  const { settings, mutation } = useExtensionLocalStorage();

  const {
    query: { data: grandtedPermissions },
    handleGrantPermission,
  } = useExtensionPermissions();

  const hasPermissions =
    grandtedPermissions?.permissions?.includes("scripting") &&
    grandtedPermissions?.permissions?.includes("webNavigation");

  if (!settings) return null;

  return (
    <div className="tw-flex tw-items-center tw-gap-2 md:tw-ml-auto">
      <Switch
        className="tw-flex-col tw-gap-2 md:tw-flex-row md:tw-gap-0"
        textLabel="Preload theme for a better experience"
        disabled={!hasPermissions}
        checked={settings.preloadTheme}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => (draft.preloadTheme = checked));
        }}
      />
      <div className="tw-text-sm tw-text-muted-foreground">
        <Tooltip
          content={
            <div className="tw-text-balance tw-p-2">
              Instead of inserting <InlineCode>&lt;style&gt;</InlineCode> tags,
              Complexity uses <InlineCode>scripting</InlineCode> and{" "}
              <InlineCode>webNavigation</InlineCode> permissions to inject
              styles before the page loads. This results in a smooth,
              flicker-free experience. Complexity{" "}
              <span className="tw-font-semibold tw-underline">ONLY</span> uses
              these permissions for theme injection - it never tracks your
              browsing history or collects any personal data. Please review the
              source code if you have further questions.
            </div>
          }
        >
          <LuHelpCircle className="tw-size-4" />
        </Tooltip>
      </div>
      {!hasPermissions && (
        <Dialog>
          <DialogTrigger asChild>
            <Button>Grant Permissions</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Grant Permissions</DialogTitle>
            </DialogHeader>
            <div>
              You&apos;ll be asked to grant the extension both{" "}
              <InlineCode>scripting</InlineCode> and{" "}
              <InlineCode>webNavigation</InlineCode> permissions. While the
              permission prompt mentions access to browsing history, we want to
              assure you that we{" "}
              <span className="tw-font-semibold tw-text-primary tw-underline">
                NEVER
              </span>{" "}
              read or store any of your history data - these permissions are
              only used for theme injection.
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  handleGrantPermission({
                    permissions: ["scripting", "webNavigation"],
                  });
                  mutation.mutate((draft) => (draft.preloadTheme = true));
                }}
              >
                Grant Permissions
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
