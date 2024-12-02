import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { toast } from "@/components/ui/use-toast";
import { ThemeFormValues } from "@/data/dashboard/themes/theme-form.types";
import { useBaseThemeForm } from "@/features/options-page/dashboard/pages/themes/hooks/useBaseThemeForm";
import { getLocalThemesService } from "@/services/indexed-db/themes/themes";

const initialValues: ThemeFormValues = {
  title: "Untitled Theme",
  fonts: { ui: "", mono: "" },
  accentColor: "",
  enhanceThreadTypography: false,
  customCss: "",
};

export function useThemeForm() {
  const { form, generateThemeData } = useBaseThemeForm(initialValues);

  const navigate = useNavigate();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["customTheme", "create"],
    mutationFn: async (data: ThemeFormValues) => {
      const themeData = await generateThemeData(data);
      const savedThemeId = await getLocalThemesService().add({
        id: `${Date.now()}-${data.title.toLowerCase().replace(/ /g, "-")}`,
        author: "local",
        config: data,
        ...themeData,
      });
      return savedThemeId;
    },
    onSuccess: () => {
      navigate("..");
      toast({
        title: t(
          "dashboard-themes-page:themesPage.toasts.create.success.title",
        ),
        description: t(
          "dashboard-themes-page:themesPage.toasts.create.success.description",
        ),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t("dashboard-themes-page:themesPage.toasts.create.error.title"),
        description: error.message,
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => mutateAsync(data));

  return {
    form,
    isPending,
    onSubmit,
  };
}
