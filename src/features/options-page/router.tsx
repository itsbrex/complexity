/* eslint-disable react-refresh/only-export-components */
import { Suspense } from "react";
import { createHashRouter, redirect } from "react-router-dom";

import { APP_CONFIG } from "@/app.config";
import LoadingOverlay from "@/components/LoadingOverlay";
import Page from "@/features/options-page/components/Page";
import ErrorPage from "@/features/options-page/dashboard/pages/ErrorPage";
import NotFoundPage from "@/features/options-page/dashboard/pages/NotFoundPage";

const Playground = lazy(
  () => import("@/features/options-page/playground/Playground"),
);

const Dashboard = lazy(
  () => import("@/features/options-page/dashboard/Dashboard"),
);

const NotificationsPage = lazy(
  () =>
    import(
      "@/features/options-page/dashboard/pages/notifications/NotificationsPage"
    ),
);

const PluginsPage = lazy(
  () => import("@/features/options-page/dashboard/pages/plugins/PluginsPage"),
);

const ThemesPage = lazy(
  () => import("@/features/options-page/dashboard/pages/themes/ThemesPage"),
);

const ReleaseNotesPage = lazy(
  () =>
    import(
      "@/features/options-page/dashboard/pages/release-notes/ReleaseNotesPage"
    ),
);
const SettingsPage = lazy(
  () => import("@/features/options-page/dashboard/pages/settings/SettingsPage"),
);

const HelpPage = lazy(
  () => import("@/features/options-page/dashboard/pages/help/HelpPage"),
);

const Onboarding = lazy(() => import("@/features/options-page/onboarding"));

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
            path: "notifications",
            element: <Page title="Notifications" page={NotificationsPage} />,
          },
          {
            path: "plugins/*",
            element: <Page title="Plugins" page={PluginsPage} />,
          },
          {
            path: "themes/*",
            element: <Page title="Themes" page={ThemesPage} />,
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
            path: "help/*",
            element: <Page title="Help" page={HelpPage} />,
          },
          {
            path: "",
            loader: () => redirect("/plugins"),
          },
        ],
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
