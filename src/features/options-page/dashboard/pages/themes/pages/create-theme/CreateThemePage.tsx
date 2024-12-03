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
        Back to themes
      </Link>
      <div>
        <h1 className="tw-mb-2 tw-text-2xl tw-font-bold">
          Create Custom Theme
        </h1>
        <p className="tw-text-muted-foreground">
          Create a custom theme with CSS and predefined options. Leave blank to
          use default values.
        </p>
      </div>
      <ThemeForm
        form={form}
        isPending={isPending}
        submitText="Create Theme"
        onSubmit={onSubmit}
      />
    </div>
  );
}
