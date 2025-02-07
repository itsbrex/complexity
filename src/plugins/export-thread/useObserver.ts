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

  const navbarChildren = useThreadDomObserverStore(
    (state) => state.$navbar?.find(">div").children().toArray() ?? null,
    deepEqual,
  );

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

  return createPortalContainer(navbarChildren);
}

function createPortalContainer(navbarChildren: HTMLElement[] | null) {
  if (navbarChildren == null) return null;

  const $anchor = $(navbarChildren).last().children().first();

  if (!$anchor.length) return null;

  const $existingPortalContainer = $(navbarChildren).find(
    `> [data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.NAVBAR_CHILD.EXPORT_THREAD_BUTTON}"]`,
  );

  if ($existingPortalContainer.length) return $existingPortalContainer[0];

  const $portalContainer = $("<div>").internalComponentAttr(
    INTERNAL_ATTRIBUTES.THREAD.NAVBAR_CHILD.EXPORT_THREAD_BUTTON,
  );

  $anchor.before($portalContainer);

  return $portalContainer[0];
}
