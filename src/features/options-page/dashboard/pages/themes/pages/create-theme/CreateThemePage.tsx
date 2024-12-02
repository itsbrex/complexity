import { LuChevronLeft } from "react-icons/lu";
import { Link } from "react-router-dom";

import { ThemeForm } from "@/features/options-page/dashboard/pages/themes/components/ThemeForm";
import { useThemeForm } from "@/features/options-page/dashboard/pages/themes/pages/create-theme/hooks/useThemeForm";

export default function CreateThemePage() {
  const { form, onSubmit, isPending } = useThemeForm();

  return (
    <div className="tw-max-w-3xl tw-space-y-6">
      <Link
        to="/themes"
        className="tw-mb-4 tw-flex tw-items-center tw-gap-2 tw-text-muted-foreground tw-transition hover:tw-text-foreground"
      >
        <LuChevronLeft />
        {t("dashboard-themes-page:themesPage.navigation.backToThemes")}
      </Link>
      <div>
        <h1 className="tw-mb-2 tw-text-2xl tw-font-bold">
          {t("dashboard-themes-page:themesPage.createPage.title")}
        </h1>
        <p className="tw-text-muted-foreground">
          {t("dashboard-themes-page:themesPage.createPage.description")}
        </p>
      </div>
      <ThemeForm
        form={form}
        isPending={isPending}
        submitText={t(
          "dashboard-themes-page:themesPage.createPage.createButton",
        )}
        onSubmit={onSubmit}
      />
    </div>
  );
}
