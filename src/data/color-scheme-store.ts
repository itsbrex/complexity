import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { DomObserver } from "@/features/plugins/_core/dom-observer/dom-observer";
import { CsLoaderRegistry } from "@/services/cs-loader-registry";

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
          $("html").attr("data-color-scheme", scheme);
        },
      }),
    ),
  ),
);

CsLoaderRegistry.register({
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
