import { QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";

import CsUiRoot from "@/entrypoints/content-scripts/loaders/cs-ui-plugins-loader/CsUiRoot";
import { queryClient } from "@/utils/ts-query-client";
import { waitForElement } from "@/utils/utils";

export async function setupCsUiPlugins() {
  await waitForElement({
    selector: "body",
  });

  const $root = $("<div>")
    .attr("id", "complexity-root")
    .appendTo(document.body);

  const root = createRoot($root[0]);

  root.render(
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <CsUiRoot />
      </I18nextProvider>
    </QueryClientProvider>,
  );
}
