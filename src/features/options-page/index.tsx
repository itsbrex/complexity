import "@/assets/extension.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { RouterProvider } from "react-router-dom";

import { Toaster } from "@/components/Toaster";
import { setupOptionPageListeners } from "@/features/options-page/listeners";
import { extensionLocalStorageQueries } from "@/services/extension-local-storage/query-keys";
import { initializeDayjsLocale } from "@/utils/dayjs";
import { initializeI18next } from "@/utils/i18next";
import { queryClient } from "@/utils/ts-query-client";

await Promise.all([
  initializeI18next(),
  initializeDayjsLocale(),
  queryClient.prefetchQuery(extensionLocalStorageQueries.data),
  setupOptionPageListeners(),
]);

(async () => {
  const [{ router }] = await Promise.all([
    import("@/features/options-page/router"),
  ]);

  ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <RouterProvider router={router} />
        <Toaster />
      </I18nextProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>,
  );
})();
