import { useSpaRouter } from "@/plugins/_api/spa-router/listeners";
import { useThreadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import { useThreadDomObserverStore } from "@/plugins/_core/dom-observers/thread/store";
import { INTERNAL_ATTRIBUTES } from "@/utils/dom-selectors";

export default function useObserver() {
  useSpaRouter();

  const messageBlocks = useThreadMessageBlocksDomObserverStore(
    (state) => state.messageBlocks,
    deepEqual,
  );

  const $navbar = useThreadDomObserverStore(
    (state) => state.$navbar,
    deepEqual,
  );

  const $bookmarkButton = useMemo(() => {
    return $navbar?.find(`button[aria-label="Save to Bookmarks"]`) ?? null;
  }, [$navbar]);

  const isAnyMessageBlockInFlight = useMemo(() => {
    return messageBlocks?.some((block) => block.states.isInFlight);
  }, [messageBlocks]);

  if (isAnyMessageBlockInFlight) {
    setTimeout(() => {
      $(
        `[data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.NAVBAR_CHILD.EXPORT_THREAD_BUTTON}"]`,
      ).remove();
    }, 0);
    return null;
  }

  return createPortalContainer($navbar, $bookmarkButton);
}

function createPortalContainer(
  $navbar: JQuery<HTMLElement> | null,
  $bookmarkButton: JQuery<HTMLElement> | null,
) {
  if ($navbar == null || !$navbar.length) return null;
  if ($bookmarkButton == null || !$bookmarkButton.length) return null;

  const $existingPortalContainer = $navbar?.find(
    `[data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.NAVBAR_CHILD.EXPORT_THREAD_BUTTON}"]`,
  );

  if ($existingPortalContainer.length) return $existingPortalContainer[0];

  const $portalContainer = $("<div>").internalComponentAttr(
    INTERNAL_ATTRIBUTES.THREAD.NAVBAR_CHILD.EXPORT_THREAD_BUTTON,
  );

  $bookmarkButton.parent().prepend($portalContainer);

  return $portalContainer[0];
}
