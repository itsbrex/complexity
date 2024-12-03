import { z } from "zod";

export const ThemeFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  fonts: z.object({
    ui: z.string().default(""),
    mono: z.string().default(""),
  }),
  accentColor: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, {
      message: "Must be a valid hex color (e.g. #72AEFD)",
    })
    .transform((val) => val.toUpperCase())
    .optional()
    .or(z.literal("")),
  enhanceThreadTypography: z.boolean().default(false),
  customCss: z.string(),
});

export type ThemeFormValues = z.infer<typeof ThemeFormSchema>;

export const defaultValues: Partial<ThemeFormValues> = {
  title: "Untitled Theme",
  fonts: {
    ui: "",
    mono: "",
  },
  accentColor: "",
  enhanceThreadTypography: false,
  customCss: "",
};
