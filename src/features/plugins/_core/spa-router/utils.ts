import { whereAmI } from "@/utils/utils";

export async function waitForNextjsGlobalObj(): Promise<void> {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (window.next?.router !== undefined) {
        $(document.body).attr("data-nextjs-router-ready", "");
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
}

export function isNextWindowObjectExists() {
  return window.next !== undefined;
}

export function applyRouteIdAttrs(location: ReturnType<typeof whereAmI>) {
  $(document.body).attr("location", location);
}
