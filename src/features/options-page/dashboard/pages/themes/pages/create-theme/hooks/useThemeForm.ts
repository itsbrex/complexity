import { zodResolver } from "@hookform/resolvers/zod";
import { parse, oklch } from "culori";
import { useForm } from "react-hook-form";

import {
  ThemeFormValues,
  defaultValues,
  themeFormSchema,
} from "@/features/options-page/dashboard/pages/themes/pages/create-theme/theme-form.types";

export function useThemeForm() {
  const form = useForm<ThemeFormValues>({
    resolver: zodResolver(themeFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const processColors = (data: ThemeFormValues) => {
    const { shade1, shade2, shade3 } = data.accentShades;

    if (shade1 && shade2 && shade3) {
      const rgbColors = {
        shade1: parse(shade1),
        shade2: parse(shade2),
        shade3: parse(shade3),
      };

      const oklchColors = {
        shade1: oklch(rgbColors.shade1),
        shade2: oklch(rgbColors.shade2),
        shade3: oklch(rgbColors.shade3),
      };

      return { rgbColors, oklchColors };
    }
    return null;
  };

  const onSubmit = (data: ThemeFormValues) => {
    const colors = processColors(data);
    if (colors) {
      console.log("RGB colors:", colors.rgbColors);
      console.log("OKLCH colors:", colors.oklchColors);
    } else {
      console.log("No accent colors specified");
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    processColors,
  };
}
