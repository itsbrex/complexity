import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { toast } from "@/components/ui/use-toast";
import { ThemeFormValues } from "@/data/dashboard/themes/theme-form.types";
import { Theme } from "@/data/plugins/themes/theme-registry.types";
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
        title: "✅ Theme saved",
        description: "Your theme has been saved successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Failed to save theme",
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
        title: "✅ Theme deleted",
        description: "Your theme has been deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Failed to delete theme",
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
