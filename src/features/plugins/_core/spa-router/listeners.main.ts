import { onMessage } from "webext-bridge/window";

import { isNextWindowObjectExists } from "@/features/plugins/_core/spa-router/utils";

export type CsUtilEvents = {
  "spa-router:isNextWindowObjectExists": () => boolean;
  "spa-router:push": ({ url }: { url: string }) => void;
};

export function setupSpaRouterListeners() {
  onMessage("spa-router:isNextWindowObjectExists", () => {
    return isNextWindowObjectExists();
  });

  onMessage("spa-router:push", ({ data: { url } }) => {
    if (!isNextWindowObjectExists())
      throw new Error("Next.js window object not found");

    try {
      window.next?.router.push(url);
    } catch (error) {
      console.error("Error during route change:", error);
    }
  });
}
