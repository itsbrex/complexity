import { useGlobalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import useToolbars from "@/features/plugins/thread/better-message-toolbars/useToolbars";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";

export function useObserveStuckToolbar() {
  const shouldObserve =
    ExtensionLocalStorageService.getCachedSync()?.plugins[
      "thread:betterMessageToolbars"
    ].sticky;

  const observerRef = useRef<IntersectionObserver | null>(null);

  const navbarHeight = useGlobalDomObserverStore(
    (state) => state.threadComponents.navbarHeight,
  );

  const toolbars = useToolbars();

  useEffect(() => {
    if (!shouldObserve || navbarHeight == null) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const $toolbar = $(entry.target);
          $toolbar.toggleClass("stuck", !entry.isIntersecting);
        });
      },
      {
        threshold: 1.0,
        rootMargin: `-${navbarHeight + 10}px 0px 0px 0px`,
      },
    );

    observerRef.current = observer;

    toolbars
      .filter((toolbar) => toolbar !== null)
      .forEach((toolbar) => observer.observe(toolbar));

    return () => observer.disconnect();
  }, [shouldObserve, toolbars, navbarHeight]);
}
