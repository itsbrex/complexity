import { Portal } from "@/components/ui/portal";
import { useSidebarDomObserverStore } from "@/plugins/_core/dom-observers/sidebar/store";
import SidebarPinnedSpacesVisToggle from "@/plugins/space-navigator/sidebar-content/PinnedItemsVisToggle";
import SidebarPinnedSpaces from "@/plugins/space-navigator/sidebar-content/PinnedSpaces";
import SpaceNavigator from "@/plugins/space-navigator/sidebar-content/SpaceNavigator";
import { INTERNAL_ATTRIBUTES } from "@/utils/dom-selectors";

export default function SpaceNavigatorWrapper() {
  const spaceButtonWrapper = useSidebarDomObserverStore(
    (state) => state.$spaceButtonWrapper?.[0],
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
        `[data-cplx-component="${INTERNAL_ATTRIBUTES.SIDEBAR.PINNED_SPACES_PORTAL_CONTAINER}"]`,
      );

    if ($existingPinnedSpacesPortalContainer.length) {
      return $existingPinnedSpacesPortalContainer;
    }

    const $portalContainer = $("<div>")
      .internalComponentAttr(
        INTERNAL_ATTRIBUTES.SIDEBAR.PINNED_SPACES_PORTAL_CONTAINER,
      )
      .insertAfter($spaceButtonWrapper);

    return $portalContainer;
  }, [spaceButtonWrapper]);

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
