import { useCallback } from "react";

import type { ColorScheme } from "@/features/plugins/command-menu/types";
import { setCookie } from "@/utils/utils";

export function useColorScheme() {
  const setColorScheme = useCallback((scheme: string) => {
    $("html").attr("data-color-scheme", scheme);
    localStorage.setItem("colorScheme", scheme);
    setCookie("colorScheme", scheme, 0);
  }, []);

  const handleColorSchemeChange = useCallback(
    (scheme: ColorScheme) => {
      if (scheme === "system") {
        const preferredColorScheme = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches
          ? "dark"
          : "light";
        setColorScheme(preferredColorScheme);
      } else {
        setColorScheme(scheme);
      }
    },
    [setColorScheme],
  );

  return {
    handleColorSchemeChange,
  };
}
