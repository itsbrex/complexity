import { QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";

import CsUiRoot from "@/entrypoints/plugins-loader/cs-ui-plugins-loader/CsUiRoot";
import { queryClient } from "@/utils/ts-query-client";

export function setupCsUiPlugins() {
  const $root = $("<div>")
    .attr("id", "complexity-root")
    .appendTo(document.body);

  const root = createRoot($root[0]);

  root.render(
    <QueryClientProvider client={queryClient}>
      <CsUiRoot />
    </QueryClientProvider>,
  );
}
