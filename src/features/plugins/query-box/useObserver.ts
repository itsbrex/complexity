import { useGlobalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";

export default function useObserver(): {
  mainQueryBoxPortalContainer: HTMLElement | null;
  mainModalQueryBoxPortalContainer: HTMLElement | null;
  spaceQueryBoxPortalContainer: HTMLElement | null;
  followUpQueryBoxPortalContainer: HTMLElement | null;
} {
  return useFindPortalContainers();
}

function useFindPortalContainers(): {
  mainQueryBoxPortalContainer: HTMLElement | null;
  mainModalQueryBoxPortalContainer: HTMLElement | null;
  spaceQueryBoxPortalContainer: HTMLElement | null;
  followUpQueryBoxPortalContainer: HTMLElement | null;
} {
  const { mainQueryBox, mainModalQueryBox, spaceQueryBox, followUpQueryBox } =
    useGlobalDomObserverStore((state) => state.queryBoxes);

  return useMemo(
    () => ({
      mainQueryBoxPortalContainer: findPortalContainer(mainQueryBox),
      mainModalQueryBoxPortalContainer: findPortalContainer(mainModalQueryBox),
      spaceQueryBoxPortalContainer: findPortalContainer(spaceQueryBox),
      followUpQueryBoxPortalContainer: findPortalContainer(followUpQueryBox),
    }),
    [mainQueryBox, mainModalQueryBox, spaceQueryBox, followUpQueryBox],
  );
}

function findPortalContainer(queryBox: HTMLElement | null) {
  if (!queryBox) return null;

  const $container = $(queryBox).find("textarea").parent().next();

  return $container.length ? $container[0] : null;
}
