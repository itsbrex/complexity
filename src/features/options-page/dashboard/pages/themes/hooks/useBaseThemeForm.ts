import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  ThemeFormSchema,
  ThemeFormValues,
} from "@/data/dashboard/themes/theme-form.types";
import { Theme } from "@/data/plugins/themes/theme-registry.types";
import {
  generateDarkModeColorOverrides,
  generatePalette,
  generateUiFontsOverrides,
} from "@/features/options-page/dashboard/pages/themes/pages/utils";

type ThemeDataResult = Pick<Theme, "css" | "title">;

export function useBaseThemeForm(defaultValues: ThemeFormValues) {
  const form = useForm<ThemeFormValues>({
    resolver: zodResolver(ThemeFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const generateThemeData = async (
    data: ThemeFormValues,
  ): Promise<ThemeDataResult> => {
    let css = "";

    if (data.accentColor) {
      css += generateDarkModeColorOverrides(generatePalette(data.accentColor));
    }
    if (data.fonts.ui || data.fonts.mono || data.enhanceThreadTypography) {
      css += generateUiFontsOverrides({
        uiFont: data.fonts.ui,
        monoFont: data.fonts.mono,
      });
    }

    if (data.enhanceThreadTypography) {
      css += (
        await import(
          "@/data/plugins/themes/css-files/complexity/base.css?inline"
        )
      ).default;
    }

    css += data.customCss;

    if (
      !data.accentColor &&
      !data.fonts.ui &&
      !data.fonts.mono &&
      !data.customCss
    ) {
      throw new Error("Please add at least one customization");
    }

    return { css, title: data.title };
  };

  return {
    form,
    generateThemeData,
  };
}
