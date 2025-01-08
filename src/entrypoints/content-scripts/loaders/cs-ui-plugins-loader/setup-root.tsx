import { QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { RouterProvider } from "react-router-dom";

import { removeInitializingIndicator } from "@/components/loading-indicator";
import CsUiRoot from "@/entrypoints/content-scripts/loaders/cs-ui-plugins-loader/CsUiRoot";
import { createRouter } from "@/entrypoints/content-scripts/loaders/cs-ui-plugins-loader/router";
import { csLoaderRegistry } from "@/services/cs-loader-registry";
import { queryClient } from "@/utils/ts-query-client";
import { waitForElement } from "@/utils/utils";

csLoaderRegistry.register({
  id: "csui:root",
  loader: async () => {
    await waitForElement({
      selector: "body",
    });

    const $root = $("<div>")
      .attr("id", "complexity-root")
      .appendTo(document.body);

    if ($root[0] == null) return;

    const root = createRoot($root[0]);
    const router = createRouter();

    removeInitializingIndicator();

    root.render(
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <CsUiRoot />
          <RouterProvider router={router} />
        </I18nextProvider>
      </QueryClientProvider>,
    );
  },
  dependencies: [
    "lib:i18next",
    "lib:dayjs",
    "cache:pluginsStates",
    "cache:languageModels",
    "cache:extensionLocalStorage",
    "cache:betterCodeBlocksFineGrainedOptions",
  ],
});
