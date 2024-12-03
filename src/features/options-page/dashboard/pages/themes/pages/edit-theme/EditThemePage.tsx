import { LuChevronLeft } from "react-icons/lu";
import { Link, useLoaderData } from "react-router-dom";

import { Theme } from "@/data/plugins/themes/theme-registry.types";
import { ThemeForm } from "@/features/options-page/dashboard/pages/themes/components/ThemeForm";
import { DeleteButton } from "@/features/options-page/dashboard/pages/themes/pages/edit-theme/components/DeleteButton";
import { useThemeForm } from "@/features/options-page/dashboard/pages/themes/pages/edit-theme/hooks/useThemeForm";

export default function EditThemePage() {
  const theme = useLoaderData() as Theme;
  const { form, isPending, onSubmit, deleteTheme, isDeleting } =
    useThemeForm(theme);

  return (
    <div className="tw-max-w-3xl tw-space-y-6">
      <Link
        to="/themes"
        className="tw-mb-4 tw-flex tw-items-center tw-gap-2 tw-text-muted-foreground tw-transition hover:tw-text-foreground"
      >
        <LuChevronLeft />
        Back to themes
      </Link>
      <div>
        <h1 className="tw-mb-2 tw-text-2xl tw-font-bold">Editing Theme</h1>
      </div>
      <ThemeForm
        form={form}
        isPending={isPending}
        submitText="Save Changes"
        footer={<DeleteButton isDeleting={isDeleting} onDelete={deleteTheme} />}
        onSubmit={onSubmit}
      />
    </div>
  );
}
