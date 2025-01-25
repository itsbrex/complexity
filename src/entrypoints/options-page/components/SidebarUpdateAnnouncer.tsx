import ExtensionUpdateInfoDialogWrapper from "@/components/ExtensionUpdateInfoDialogWrapper";
import useExtensionUpdate from "@/hooks/useExtensionUpdate";

export default function SidebarUpdateAnnouncer() {
  const { isUpdateAvailable } = useExtensionUpdate();

  if (!isUpdateAvailable) return null;

  return (
    <ExtensionUpdateInfoDialogWrapper>
      <div className="x-group x-relative x-flex x-w-full x-cursor-pointer x-items-start x-gap-2 x-rounded-md x-border x-border-border/50 x-bg-secondary x-p-4 x-text-sm x-font-medium x-shadow-lg x-transition-all hover:x-scale-105 hover:x-border-primary hover:x-bg-primary/10">
        <span className="x-flex-1 x-text-balance x-text-left">
          A new version of the extension is available!
        </span>
        <div className="x-absolute -x-right-1 -x-top-1 x-size-3 x-animate-ping x-rounded-full x-bg-primary" />
        <div className="x-absolute -x-right-1 -x-top-1 x-size-3 x-rounded-full x-bg-primary" />
      </div>
    </ExtensionUpdateInfoDialogWrapper>
  );
}
