import { useGlobalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { DOM_SELECTORS } from "@/utils/dom-selectors";

export default function useObserver() {
  const popper = useGlobalDomObserverStore(
    (state) => state.threadComponents.popper,
  );

  return useMemo(() => findOptionsGridHeader(popper), [popper]);
}

function findOptionsGridHeader(popper: HTMLElement | null) {
  if (!popper) return null;

  const $header = $(popper)
    .find(DOM_SELECTORS.THREAD.MESSAGE.VISUAL_COL_CHILD.IMAGE_GEN.OPTIONS_GRID)
    .prev();

  if (!$header.length) return null;

  return $header[0];
}
