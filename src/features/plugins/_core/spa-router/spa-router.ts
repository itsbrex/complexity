import debounce from "lodash/debounce";
import { sendMessage } from "webext-bridge/window";

import {
  NextRouter,
  RouterEvent,
} from "@/features/plugins/_core/spa-router/spa-router.types";
import {
  applyRouteIdAttrs,
  isNextWindowObjectExists,
} from "@/features/plugins/_core/spa-router/utils";
import { MaybePromise } from "@/types/utils.types";
import { DOM_SELECTORS } from "@/utils/dom-selectors";
import UiUtils from "@/utils/UiUtils";
import { whereAmI } from "@/utils/utils";

onlyMainWorldGuard();

let lastDispatchedUrl: string | null = null;

export function proxyNextRouter() {
  if (!isNextWindowObjectExists()) throw new Error("Next.js router not found");

  const router = window.next!.router;
  const originalPush = router.push;
  const originalReplaceState = history.replaceState;

  router.push = createProxiedPush(originalPush);

  history.replaceState = createProxiedReplaceState(originalReplaceState);

  window.addEventListener("popstate", () =>
    dispatchRouteChange({
      trigger: "popstate",
      newUrl: window.location.href,
    }),
  );

  applyRouteIdAttrs(whereAmI());
}

function createProxiedPush(
  originalPush: NonNullable<NextRouter>["router"]["push"],
) {
  return async function (this: NextRouter, url: string): Promise<void> {
    originalPush.apply(this, [url]);
    dispatchRouteChange({
      trigger: "push",
      newUrl: url,
    });
  };
}

function createProxiedReplaceState(
  originalReplaceState: typeof history.replaceState,
) {
  return function (
    this: History,
    data: unknown,
    unused: string,
    url?: string | URL | null,
  ): void {
    originalReplaceState.apply(this, [data, unused, url]);
    if (typeof url === "string") {
      dispatchRouteChange({
        trigger: "replace",
        newUrl: url,
      });
    }
  };
}

const dispatchRouteChange = debounce(
  async ({ trigger, newUrl }: { trigger: RouterEvent; newUrl: string }) => {
    const fullUrl = new URL(newUrl, window.location.origin).href;

    if (fullUrl !== lastDispatchedUrl) {
      lastDispatchedUrl = fullUrl;

      // hacky solution since router events are no longer available in next app router 🥲 (routeChangeStart, routeChangeComplete)
      await waitForRouteChangeComplete(whereAmI(fullUrl));

      sendMessage(
        "spa-router:route-change",
        { trigger, newUrl },
        "content-script",
      );
    }
  },
  300,
  { leading: false, trailing: true },
);

export async function waitForRouteChangeComplete(
  location: ReturnType<typeof whereAmI>,
) {
  applyRouteIdAttrs(location);

  const locationChecks: Partial<
    Record<ReturnType<typeof whereAmI>, () => MaybePromise<boolean>>
  > = {
    thread: checkThreadLoaded,
    home: checkHomeLoaded,
  };

  const check = locationChecks[location] ?? waitForSpaIdle;

  await waitForConditionOrTimeout(check);

  async function checkThreadLoaded() {
    await waitForSpaIdle();

    try {
      return UiUtils.getMessageBlocks(true).length >= 1;
    } catch {
      return false;
    }
  }

  function checkHomeLoaded() {
    return $(DOM_SELECTORS.HOME.SLOGAN).length > 0;
  }

  async function waitForConditionOrTimeout(
    condition: () => MaybePromise<boolean>,
    timeout = 3000,
    interval = 100,
  ) {
    let timeoutReached = false;

    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => {
        timeoutReached = true;
        resolve(undefined);
      }, timeout);
    });

    const checkCondition = async () => {
      while (!timeoutReached && !(await condition())) {
        await sleep(interval);
      }
    };

    await Promise.race([checkCondition(), timeoutPromise]);
  }
}

function waitForSpaIdle(): Promise<boolean> {
  // watch the wrapper ".max-w-screen" via mutation observer, if it has stopped emitting events for a while, we can assume the SPA update is finished
  return new Promise<boolean>((resolve) => {
    // const startTime = Date.now();
    // console.log("waitForSpaIdle: Start waiting for SPA to become idle.");

    const wrapper = $(DOM_SELECTORS.WRAPPER);
    if (!wrapper.length) {
      // console.log("waitForSpaIdle: No wrapper found, resolving immediately.");
      return resolve(true);
    }

    const IDLE_TIME = 10;
    const IDLE_TIMEOUT = 3000;

    let timeout: NodeJS.Timeout;
    let isIdle = false;

    function mutationDisconnect() {
      if (isIdle) return;
      isIdle = true;

      observer.disconnect();
      // const endTime = Date.now();
      // console.log(
      //   `waitForSpaIdle: SPA became idle after ${endTime - startTime} ms.`,
      // );

      resolve(true);
    }

    function mutationFn() {
      clearTimeout(timeout);
      timeout = setTimeout(mutationDisconnect, IDLE_TIME);
    }

    const observer = new MutationObserver(mutationFn);

    observer.observe(wrapper[0], {
      childList: true,
      subtree: false,
    });

    setTimeout(() => {
      if (isIdle) return;
      // console.log("waitForSpaIdle: Timeout reached, disconnecting observer.");
      observer.disconnect();
    }, IDLE_TIMEOUT);
  });
}
