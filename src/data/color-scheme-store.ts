import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { DomObserver } from "@/features/plugins/_core/dom-observer/dom-observer";
import { csLoaderRegistry } from "@/services/cs-loader-registry";
import { setCookie, whereAmI } from "@/utils/utils";

export type ColorScheme = "light" | "dark" | "system";

type ColorSchemeStoreType = {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
};

export const colorSchemeStore = createWithEqualityFn<ColorSchemeStoreType>()(
  subscribeWithSelector(
    immer(
      (set): ColorSchemeStoreType => ({
        colorScheme: "system",
        setColorScheme: (scheme) => {
          const systemPreference = window.matchMedia(
            "(prefers-color-scheme: dark)",
          ).matches
            ? "dark"
            : "light";

          if (scheme === "system") {
            $("html").attr("data-color-scheme", systemPreference);
          } else {
            $("html").attr("data-color-scheme", scheme);
          }

          if (whereAmI() !== "unknown") {
            setCookie(
              "colorScheme",
              scheme === "system" ? systemPreference : scheme,
              365,
            );
          }
        },
      }),
    ),
  ),
);

csLoaderRegistry.register({
  id: "store:colorScheme",
  loader: () => {
    DomObserver.create("colorScheme", {
      target: $("html")[0],
      config: {
        subtree: false,
        childList: false,
        attributes: true,
        attributeFilter: ["data-color-scheme"],
      },
      onMutation: () => {
        colorSchemeStore.setState((state) => {
          state.colorScheme =
            $("html").attr("data-color-scheme") === "dark" ? "dark" : "light";
        });
      },
    });
  },
});

export const useColorSchemeStore = colorSchemeStore;
