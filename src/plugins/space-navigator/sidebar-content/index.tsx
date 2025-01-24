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

    $spaceButtonWrapper.addClass("tw-group");

    const $target = $spaceButtonWrapper.find(
      `.flex.items-center.min-w-0.justify-left.w-full.gap-xs`,
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

  return (
    <>
      {$triggerButtonsPortalContainer != null &&
        $triggerButtonsPortalContainer.length && (
          <Portal container={$triggerButtonsPortalContainer[0]}>
            <div className="-tw-mr-2 tw-flex tw-w-full tw-flex-1 tw-items-center tw-justify-end tw-gap-1">
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
