import SponsorDialogWrapper from "@/components/SponsorDialogWrapper";
import { Portal } from "@/components/ui/portal";
import { useGlobalDomObserverStore } from "@/plugins/_api/dom-observer/global-dom-observer-store";

export function SponsorHomeLink() {
  const bottomBar = useGlobalDomObserverStore(
    (state) => state.homeComponents.bottomBar,
  );

  const portalContainer = useMemo(() => {
    if (!bottomBar) return null;

    const $existingContainer = $(bottomBar).find(
      `[data-cplx-component="sponsor-home-link-container"]`,
    );

    if ($existingContainer.length) return $existingContainer[0];

    const $container = $("<div>").internalComponentAttr(
      "sponsor-home-link-container",
    );

    $(bottomBar).prepend($container);

    return $container[0];
  }, [bottomBar]);

  return (
    <Portal container={portalContainer}>
      <SponsorDialogWrapper>
        <div className="tw-cursor-pointer tw-text-sm tw-text-muted-foreground tw-decoration-muted-foreground/50 hover:tw-underline">
          Support Complexity
        </div>
      </SponsorDialogWrapper>
    </Portal>
  );
}
