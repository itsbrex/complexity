import ExtensionUpdateInfoDialogWrapper from "@/components/ExtensionUpdateInfoDialogWrapper";
import { Portal } from "@/components/ui/portal";
import useExtensionUpdate from "@/hooks/useExtensionUpdate";
import { useGlobalDomObserverStore } from "@/plugins/_api/dom-observer/global-dom-observer-store";

export default function HomepageUpdateAnnouncer() {
  const { isUpdateAvailable } = useExtensionUpdate();

  const sloganWrapper = useGlobalDomObserverStore(
    (state) => state.homeComponents.slogan,
  );

  if (!sloganWrapper || !isUpdateAvailable) return null;

  const $anchor = $(sloganWrapper).find(">*").first();

  return (
    <Portal container={$anchor[0]}>
      <ExtensionUpdateInfoDialogWrapper>
        <div className="tw-text-sm tw-text-muted-foreground">
          A new version of the extension is available!
        </div>
      </ExtensionUpdateInfoDialogWrapper>
    </Portal>
  );
}
