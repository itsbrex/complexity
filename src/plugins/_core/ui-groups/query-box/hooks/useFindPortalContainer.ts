import { useWindowSize, useDebounce } from "@uidotdev/usehooks";

import {
  DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS,
  DOM_SELECTORS,
} from "@/utils/dom-selectors";

export function useFindToolbarPortalContainer(
  queryBox: HTMLElement | null,
  queryBoxType: "main" | "main-modal" | "space" | "follow-up",
) {
  const wndSize = useDebounce(useWindowSize(), 1000);

  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    () => findToolbarPortalContainer(queryBox),
  );

  useEffect(() => {
    if (portalContainer != null) {
      const $components = $(portalContainer).find(
        `>:not(${DOM_SELECTORS.QUERY_BOX.INCOGNITO_TOGGLE})`,
      );

      if (queryBoxType === "follow-up") {
        if ($components.length > 0 && $components[0]?.tagName !== "SPAN") {
          setPortalContainer(null);
          return;
        }
      } else {
        if (
          $components.length > 1 &&
          ($components[0]?.tagName !== "SPAN" ||
            $components[1]?.tagName !== "SPAN")
        ) {
          setPortalContainer(null);
          return;
        }
      }
    }

    setPortalContainer(findToolbarPortalContainer(queryBox));
  }, [queryBox, portalContainer, wndSize, queryBoxType]);

  return portalContainer;
}

function findToolbarPortalContainer(queryBox: HTMLElement | null) {
  if (!queryBox) return null;

  const $queryBoxWrapper = $(queryBox).find("textarea").parent();

  const $queryBoxComponentsWrapper = $queryBoxWrapper.parent();

  const $toolbar = $queryBoxWrapper.next();

  $queryBoxComponentsWrapper.internalComponentAttr(
    DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.QUERY_BOX_CHILD.COMPONENTS_WRAPPER,
  );

  return $toolbar.length ? $toolbar[0] : null;
}
