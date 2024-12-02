import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { toast } from "@/components/ui/use-toast";
import { Theme } from "@/data/plugins/themes/theme-registry.types";
import { ThemeFormValues } from "@/data/themes/theme-form.types";
import { useBaseThemeForm } from "@/features/options-page/dashboard/pages/themes/hooks/useBaseThemeForm";
import { getLocalThemesService } from "@/services/indexed-db/themes/themes";

export function useThemeForm(theme: Theme) {
  const initialValues: ThemeFormValues = {
    title: theme.title,
    fonts: theme.config?.fonts ?? { ui: "", mono: "" },
    accentColor: theme.config?.accentColor ?? "",
    enhanceThreadTypography: theme.config?.enhanceThreadTypography ?? false,
    customCss: theme.config?.customCss ?? "",
  };

  const navigate = useNavigate();

  const { form, generateThemeData } = useBaseThemeForm(initialValues);

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["customTheme", "edit", theme.id],
    mutationFn: async (data: ThemeFormValues) => {
      const themeData = await generateThemeData(data);
      await getLocalThemesService().update({
        ...theme,
        ...themeData,
        config: data,
      });
      return theme;
    },
    onSuccess: (_, variables) => {
      form.reset({
        ...initialValues,
        ...variables,
      });
      toast({
        title: t("dashboard-themes-page:themesPage.toasts.save.success.title"),
        description: t(
          "dashboard-themes-page:themesPage.toasts.save.success.description",
        ),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t("dashboard-themes-page:themesPage.toasts.save.error.title"),
        description: error.message,
      });
    },
  });

  const { mutateAsync: deleteTheme, isPending: isDeleting } = useMutation({
    mutationKey: ["customTheme", "delete", theme.id],
    mutationFn: async () => {
      await getLocalThemesService().delete(theme.id);
    },
    onSuccess: () => {
      navigate("..");
      toast({
        title: t(
          "dashboard-themes-page:themesPage.toasts.delete.success.title",
        ),
        description: t(
          "dashboard-themes-page:themesPage.toasts.delete.success.description",
        ),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t("dashboard-themes-page:themesPage.toasts.delete.error.title"),
        description: error.message,
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => mutateAsync(data));

  return {
    form,
    isPending,
    onSubmit,
    deleteTheme,
    isDeleting,
  };
}
