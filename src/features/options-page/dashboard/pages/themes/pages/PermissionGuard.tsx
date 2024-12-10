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

  if (grandtedPermissions?.permissions?.includes("scripting")) return children;

  return (
    <div className="tw-flex tw-size-full tw-items-center tw-justify-center">
      <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-4">
        <div className="tw-text-2xl tw-text-center tw-text-balance">
          Please allow the extension to use <InlineCode>scripting</InlineCode>{" "}
          permission.
        </div>
        <div>
          <Button
            onClick={() =>
              handleGrantPermission({ permissions: ["scripting"] })
            }
          >
            Grant Permission
          </Button>
        </div>
      </div>
    </div>
  );
}
