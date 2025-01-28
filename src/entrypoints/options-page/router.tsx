/* eslint-disable react-refresh/only-export-components */
import { Suspense } from "react";
import { createHashRouter, redirect } from "react-router-dom";

import { APP_CONFIG } from "@/app.config";
import LoadingOverlay from "@/components/LoadingOverlay";
import Page from "@/entrypoints/options-page/components/Page";
import ErrorPage from "@/entrypoints/options-page/dashboard/pages/ErrorPage";
import NotFoundPage from "@/entrypoints/options-page/dashboard/pages/NotFoundPage";
import PluginsPage from "@/entrypoints/options-page/dashboard/pages/plugins/PluginsPage";
import { ThemesPageRoutes } from "@/entrypoints/options-page/dashboard/pages/themes/routes";

const Playground = lazy(
  () => import("@/entrypoints/options-page/playground/Playground"),
);

const Dashboard = lazy(
  () => import("@/entrypoints/options-page/dashboard/Dashboard"),
);

const ReleaseNotesPage = lazy(
  () =>
    import(
      "@/entrypoints/options-page/dashboard/pages/release-notes/ReleaseNotesPage"
    ),
);

const DirectReleaseNotesPage = lazy(
  () =>
    import(
      "@/entrypoints/options-page/dashboard/pages/release-notes/DirectReleaseNotesPage"
    ),
);

const SettingsPage = lazy(
  () =>
    import("@/entrypoints/options-page/dashboard/pages/settings/SettingsPage"),
);

const Onboarding = lazy(() => import("@/entrypoints/options-page/onboarding"));

export const router: ReturnType<typeof createHashRouter> = createHashRouter([
  {
    path: "/",
    children: [
      {
        element: (
          <Suspense fallback={<LoadingOverlay />}>
            <Dashboard />
          </Suspense>
        ),
        children: [
          {
            path: "plugins/*",
            element: <Page title="Plugins" page={PluginsPage} />,
          },
          {
            path: "themes/*",
            children: ThemesPageRoutes,
          },
          {
            path: "release-notes/*",
            element: <Page title="Release Notes" page={ReleaseNotesPage} />,
          },
          {
            path: "settings/*",
            element: <Page title="Settings" page={SettingsPage} />,
          },
          {
            path: "",
            loader: () => redirect("/plugins"),
          },
        ],
      },
      {
        path: "direct-release-notes",
        element: <Page title="Release Notes" page={DirectReleaseNotesPage} />,
        loader: ({ request }) => {
          const url = new URL(request.url);
          const version = url.searchParams.get("version");

          if (!version) return redirect("/");

          return { version };
        },
      },
      {
        path: "onboarding",
        element: (
          <Suspense fallback={<LoadingOverlay />}>
            <Page title="Onboarding" page={Onboarding} />
          </Suspense>
        ),
      },
      {
        path: "playground",
        element: (
          <Suspense fallback={<LoadingOverlay />}>
            <Page title="Playground" page={Playground} />
          </Suspense>
        ),
        loader: () => {
          if (!APP_CONFIG.IS_DEV) {
            return redirect("/");
          }
          return null;
        },
      },
      {
        path: "*",
        element: <Page title="Not Found" page={NotFoundPage} />,
      },
    ],
    errorElement: <ErrorPage />,
  },
]);
