import { LoaderFunctionArgs, RouteObject, redirect } from "react-router-dom";

import { BUILTIN_THEME_REGISTRY } from "@/data/plugins/themes/theme-registry";
import Page from "@/features/options-page/components/Page";
import { getLocalThemesService } from "@/services/indexed-db/themes/themes";

const CreateThemePage = lazy(
  () =>
    import(
      "@/features/options-page/dashboard/pages/themes/pages/create-theme/CreateThemePage"
    ),
);

const EditThemePage = lazy(
  () =>
    import(
      "@/features/options-page/dashboard/pages/themes/pages/edit-theme/EditThemePage"
    ),
);

const ThemesListing = lazy(
  () =>
    import(
      "@/features/options-page/dashboard/pages/themes/pages/ThemesListing"
    ),
);

export async function themeLoader({ params }: LoaderFunctionArgs) {
  const { themeId } = params;

  if (!themeId) return redirect("/themes");

  const builtInTheme = BUILTIN_THEME_REGISTRY.find(
    (theme) => theme.id === themeId,
  );

  if (builtInTheme) return builtInTheme;

  const localTheme = await getLocalThemesService().get(themeId);

  if (!localTheme) return redirect("/themes");

  return localTheme;
}

export const ThemesPageRoutes: RouteObject[] = [
  {
    path: "new",
    element: <Page title="Create Custom Theme" page={CreateThemePage} />,
  },
  {
    path: ":themeId",
    children: [
      {
        index: true,
        loader: () => redirect("/themes"),
      },
      {
        path: "edit",
        id: "editTheme",
        loader: themeLoader,
        element: <Page title="Edit Custom Theme" page={EditThemePage} />,
      },
    ],
  },
  {
    index: true,
    element: <Page title="Custom Themes" page={ThemesListing} />,
  },
];
