import { Portal } from "@/components/ui/portal";
import { useGlobalDomObserverStore } from "@/plugins/_api/dom-observer/global-dom-observer-store";
import SidebarPinnedSpacesVisToggle from "@/plugins/space-navigator/sidebar-content/PinnedItemsVisToggle";
import SidebarPinnedSpaces from "@/plugins/space-navigator/sidebar-content/PinnedSpaces";
import SpaceNavigator from "@/plugins/space-navigator/sidebar-content/SpaceNavigator";
import { DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS } from "@/utils/dom-selectors";

export default function SpaceNavigatorWrapper() {
  const spaceButtonWrapper = useGlobalDomObserverStore(
    (state) => state.sidebarComponents.spaceButtonWrapper,
  );

  const $triggerButtonsPortalContainer = useMemo(() => {
    if (spaceButtonWrapper == null) return null;

    const $spaceButtonWrapper = $(spaceButtonWrapper);

    $spaceButtonWrapper.addClass("x-group");

    const $target = $spaceButtonWrapper.find(
      `.flex.items-center.min-w-0.justify-left.w-full.gap-sm`,
    );

    return $target;
  }, [spaceButtonWrapper]);

  const $pinnedSpacesPortalContainer = useMemo(() => {
    if (spaceButtonWrapper == null) return null;

    const $spaceButtonWrapper = $(spaceButtonWrapper);

    const $existingPinnedSpacesPortalContainer = $spaceButtonWrapper
      .parent()
      .find(
        `[data-cplx-component="${DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.SIDEBAR.PINNED_SPACES_PORTAL_CONTAINER}"]`,
      );

    if ($existingPinnedSpacesPortalContainer.length) {
      return $existingPinnedSpacesPortalContainer;
    }

    const $portalContainer = $("<div>")
      .internalComponentAttr(
        DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.SIDEBAR
          .PINNED_SPACES_PORTAL_CONTAINER,
      )
      .insertAfter($spaceButtonWrapper);

    return $portalContainer;
  }, [spaceButtonWrapper]);

  console.log($triggerButtonsPortalContainer);

  return (
    <>
      {$triggerButtonsPortalContainer != null &&
        $triggerButtonsPortalContainer.length && (
          <Portal container={$triggerButtonsPortalContainer[0]}>
            <div className="-x-mr-2 x-flex x-w-full x-flex-1 x-items-center x-justify-end x-gap-1">
              <SidebarPinnedSpacesVisToggle />
              <SpaceNavigator />
            </div>
          </Portal>
        )}
      {$pinnedSpacesPortalContainer != null &&
        $pinnedSpacesPortalContainer.length && (
          <Portal container={$pinnedSpacesPortalContainer[0]}>
            <SidebarPinnedSpaces />
          </Portal>
        )}
    </>
  );
}
