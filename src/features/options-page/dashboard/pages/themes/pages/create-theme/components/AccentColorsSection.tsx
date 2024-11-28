import { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ColorInput } from "@/features/options-page/dashboard/pages/themes/pages/create-theme/components/ColorInput";
import { ThemeFormValues } from "@/features/options-page/dashboard/pages/themes/pages/create-theme/theme-form.types";

type AccentColorsSectionProps = {
  form: UseFormReturn<ThemeFormValues>;
};

export function AccentColorsSection({ form }: AccentColorsSectionProps) {
  return (
    <FormField
      control={form.control}
      name="accentShades"
      render={({ formState: { errors } }) => (
        <FormItem>
          <FormLabel>Accent Colors</FormLabel>
          <FormControl>
            <div className="tw-space-y-4">
              <FormField
                control={form.control}
                name="accentShades.shade1"
                render={({ field: shadeField }) => (
                  <ColorInput
                    value={shadeField.value}
                    label="Shade 1"
                    description="Primary accent color (darkest shade)"
                    onChange={shadeField.onChange}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="accentShades.shade2"
                render={({ field: shadeField }) => (
                  <ColorInput
                    value={shadeField.value}
                    label="Shade 2"
                    description="Secondary accent color (medium shade)"
                    onChange={shadeField.onChange}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="accentShades.shade3"
                render={({ field: shadeField }) => (
                  <ColorInput
                    value={shadeField.value}
                    label="Shade 3"
                    description="Tertiary accent color (lightest shade)"
                    onChange={shadeField.onChange}
                  />
                )}
              />
            </div>
          </FormControl>
          {errors.accentShades?.root?.message && (
            <FormMessage>{errors.accentShades?.root?.message}</FormMessage>
          )}
        </FormItem>
      )}
    />
  );
}
