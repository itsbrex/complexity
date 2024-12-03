import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  TOGGLEABLE_PERMISSIONS,
  TOGGLEABLE_PERMISSIONS_DETAILS,
} from "@/data/extension-permissions";
import { useExtensionPermissions } from "@/services/extension-permissions/useExtensionPermissions";

export default function ManagePermissionsDialogWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    query: { data: grandtedPermissions },
    handleGrantPermission,
    handleRevokePermission,
  } = useExtensionPermissions();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t(
              "dashboard-settings-page:settingsPage.items.permissions.dialog.title",
            )}
          </DialogTitle>
          <DialogDescription>
            {t(
              "dashboard-settings-page:settingsPage.items.permissions.dialog.description",
            )}
          </DialogDescription>
          {TOGGLEABLE_PERMISSIONS.map((permission) => (
            <div
              key={permission}
              className="!tw-mt-4 tw-flex tw-flex-col tw-gap-2"
            >
              <Switch
                className="tw-items-start tw-text-muted-foreground"
                textLabel={
                  <div className="tw-flex tw-flex-col">
                    <div>
                      {TOGGLEABLE_PERMISSIONS_DETAILS[permission]?.title}
                    </div>
                    <div className="tw-text-sm tw-text-muted-foreground">
                      {TOGGLEABLE_PERMISSIONS_DETAILS[permission]?.description}
                    </div>
                  </div>
                }
                checked={grandtedPermissions?.permissions?.includes(permission)}
                onCheckedChange={() => {
                  if (grandtedPermissions?.permissions?.includes(permission)) {
                    handleRevokePermission({ permissions: [permission] });
                  } else {
                    handleGrantPermission({ permissions: [permission] });
                  }
                }}
              />
            </div>
          ))}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
