import { useThreadDomObserverStore } from "@/plugins/_core/dom-observers/thread/store";
import { INTERNAL_ATTRIBUTES } from "@/utils/dom-selectors";

export default function useObserver() {
  const $bookmarkButton = useThreadDomObserverStore(
    (state) => state.$bookmarkButton,
    deepEqual,
  );

  return useMemo(() => {
    if ($bookmarkButton == null || !$bookmarkButton.length) return null;

    const $wrapper = $bookmarkButton.parent();

    const $existingPortalContainer = $wrapper.find(
      `[data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.NAVBAR_CHILD.EXPORT_THREAD_BUTTON}"]`,
    );

    if ($existingPortalContainer.length) return $existingPortalContainer[0];

    const $portalContainer = $("<div>").internalComponentAttr(
      INTERNAL_ATTRIBUTES.THREAD.NAVBAR_CHILD.EXPORT_THREAD_BUTTON,
    );

    $wrapper.prepend($portalContainer);

    return $portalContainer[0];
  }, [$bookmarkButton]);
}
