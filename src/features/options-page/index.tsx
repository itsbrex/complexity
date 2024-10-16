import "@/assets/extension.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { RouterProvider } from "react-router-dom";

import { setupOptionPageListeners } from "@/features/options-page/listeners";
import { router } from "@/features/options-page/router";
import { extensionLocalStorageQueries } from "@/services/extension-local-storage/query-keys";
import { queryClient } from "@/utils/ts-query-client";

await queryClient.prefetchQuery(extensionLocalStorageQueries.data);
setupOptionPageListeners();

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18n}>
      <RouterProvider router={router} />
    </I18nextProvider>
    <ReactQueryDevtools />
  </QueryClientProvider>,
);
