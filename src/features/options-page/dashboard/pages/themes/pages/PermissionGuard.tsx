import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { InlineCode } from "@/components/ui/typography";
import { useExtensionPermissions } from "@/services/extension-permissions/useExtensionPermissions";

export default function ThemesPagePermissionGuardPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    query: { data: grandtedPermissions },
    handleGrantPermission,
  } = useExtensionPermissions();

  const hasPermissions =
    grandtedPermissions?.permissions?.includes("scripting") &&
    grandtedPermissions?.permissions?.includes("webNavigation");

  if (hasPermissions) return children;

  return (
    <div className="tw-flex tw-size-full tw-items-center tw-justify-center">
      <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-4">
        <div className="tw-text-balance tw-text-center tw-text-2xl">
          Please allow the extension to use both{" "}
          <InlineCode>scripting</InlineCode> and{" "}
          <InlineCode>webNavigation</InlineCode> permission.
        </div>
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
          <div className="tw-cursor-default tw-text-balance tw-text-sm tw-text-muted-foreground tw-underline">
            Why?
          </div>
        </Tooltip>
        <div>
          <Button
            onClick={() =>
              handleGrantPermission({
                permissions: ["scripting", "webNavigation"],
              })
            }
          >
            Grant Permission
          </Button>
        </div>
      </div>
    </div>
  );
}
