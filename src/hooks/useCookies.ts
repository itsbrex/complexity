import { CallbackQueue } from "@/features/plugins/_core/dom-observer/callback-queue";
import { DomObserver } from "@/features/plugins/_core/dom-observer/dom-observer";

type Cookie = {
  name: string;
  value: string;
};

const DOM_OBSERVER_ID = "cookies-pplx-incognito-mode";

export function useCookies() {
  const [cookies, setCookies] = useState<Cookie[]>([]);

  const parseCookies = useCallback(() => {
    const cookieStrings = document.cookie.split(";");
    const parsedCookies: Cookie[] = cookieStrings
      .map((cookieStr) => {
        const parts = cookieStr.trim().split("=");
        if (parts.length !== 2) return null;
        const [cookieName, cookieValue] = parts;
        if (!cookieName) return null;
        return {
          name: cookieName,
          value: decodeURIComponent(cookieValue || ""),
        };
      })
      .filter((cookie): cookie is Cookie => cookie !== null);

    setCookies((prevCookies) => {
      const hasChanged =
        prevCookies.length !== parsedCookies.length ||
        prevCookies.some(
          (prevCookie, index) =>
            !parsedCookies[index] ||
            prevCookie.name !== parsedCookies[index].name ||
            prevCookie.value !== parsedCookies[index].value,
        );

      return hasChanged ? parsedCookies : prevCookies;
    });
  }, []);

  useEffect(() => {
    parseCookies();

    DomObserver.create(DOM_OBSERVER_ID, {
      target: document.body,
      config: {
        childList: true,
        subtree: true,
      },
      onMutation: () =>
        CallbackQueue.getInstance().enqueue(parseCookies, DOM_OBSERVER_ID),
    });

    return () => {
      DomObserver.destroy(DOM_OBSERVER_ID);
    };
  }, [parseCookies]);

  return cookies;
}
