import { Portal } from "@/components/ui/portal";
import { useSidebarDomObserverStore } from "@/plugins/_core/dom-observers/sidebar/store";
import SidebarToggleableRecentThreadsToggleButton from "@/plugins/sidebar-toggleable-recent-threads/ToggleButton";
import { INTERNAL_ATTRIBUTES } from "@/utils/dom-selectors";

export default function SidebarToggleableRecentThreadsWrapper() {
  const libraryButtonWrapper = useSidebarDomObserverStore(
    (state) => state.$libraryButtonWrapper?.[0],
    deepEqual,
  );

  const triggerButtonsPortalContainer = useMemo(() => {
    if (libraryButtonWrapper == null) return null;

    const $existingPortalContainer = $(libraryButtonWrapper).find(
      `[data-cplx-component="${INTERNAL_ATTRIBUTES.SIDEBAR.LIBRARY_BUTTON_PORTAL_CONTAINER}"]`,
    );

    if ($existingPortalContainer.length) {
      return $existingPortalContainer[0];
    }

    const $libraryButtonWrapper = $(libraryButtonWrapper);

    $libraryButtonWrapper.addClass("x-group");

    const $target = $libraryButtonWrapper.find(
      `.flex.items-center.min-w-0.justify-left.w-full.gap-sm .-mr-sm.flex.w-full.flex-1.justify-end`,
    );

    const $portalContainer = $("<div>")
      .addClass("x-mr-1")
      .internalComponentAttr(
        INTERNAL_ATTRIBUTES.SIDEBAR.LIBRARY_BUTTON_PORTAL_CONTAINER,
      );

    $target.prepend($portalContainer);

    return $portalContainer[0];
  }, [libraryButtonWrapper]);

  if (triggerButtonsPortalContainer == null) return null;

  return (
    <Portal container={triggerButtonsPortalContainer}>
      <SidebarToggleableRecentThreadsToggleButton />
    </Portal>
  );
}
