import ExtensionUpdateInfoDialogWrapper from "@/components/ExtensionUpdateInfoDialogWrapper";
import useExtensionUpdate from "@/hooks/useExtensionUpdate";

export default function SidebarUpdateAnnouncer() {
  const { isUpdateAvailable } = useExtensionUpdate();

  if (!isUpdateAvailable) return null;

  return (
    <ExtensionUpdateInfoDialogWrapper>
      <div className="tw-group tw-relative tw-flex tw-w-full tw-cursor-pointer tw-items-start tw-gap-2 tw-rounded-md tw-border tw-border-border/50 tw-bg-secondary tw-p-4 tw-text-sm tw-font-medium tw-shadow-lg tw-transition-all hover:tw-scale-105 hover:tw-border-primary hover:tw-bg-primary/10">
        <span className="tw-flex-1 tw-text-balance tw-text-left">
          A new version of the extension is available!
        </span>
        <div className="tw-absolute -tw-right-1 -tw-top-1 tw-size-3 tw-animate-ping tw-rounded-full tw-bg-primary" />
        <div className="tw-absolute -tw-right-1 -tw-top-1 tw-size-3 tw-rounded-full tw-bg-primary" />
      </div>
    </ExtensionUpdateInfoDialogWrapper>
  );
}
