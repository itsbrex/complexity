import { z } from "zod";

export const themeFormSchema = z.object({
  fonts: z.object({
    ui: z.string().default(""),
    mono: z.string().default(""),
  }),
  accentShades: z
    .object({
      shade1: z
        .string()
        .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, {
          message: "Must be a valid hex color (e.g. #000000)",
        })
        .transform((val) => val.toUpperCase())
        .optional()
        .or(z.literal("")),
      shade2: z
        .string()
        .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, {
          message: "Must be a valid hex color (e.g. #000000)",
        })
        .transform((val) => val.toUpperCase())
        .optional()
        .or(z.literal("")),
      shade3: z
        .string()
        .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, {
          message: "Must be a valid hex color (e.g. #000000)",
        })
        .transform((val) => val.toUpperCase())
        .optional()
        .or(z.literal("")),
    })
    .refine(
      (data) => {
        const hasShade1 = !!data.shade1;
        const hasShade2 = !!data.shade2;
        const hasShade3 = !!data.shade3;
        const allShadesPresent = hasShade1 && hasShade2 && hasShade3;
        const noShadesPresent = !hasShade1 && !hasShade2 && !hasShade3;
        return allShadesPresent || noShadesPresent;
      },
      {
        message: "Either specify all accent shades or none",
      },
    ),
  customCss: z.string(),
});

export type ThemeFormValues = z.infer<typeof themeFormSchema>;

export const defaultValues: Partial<ThemeFormValues> = {
  fonts: {
    ui: "",
    mono: "",
  },
  accentShades: {
    shade1: "",
    shade2: "",
    shade3: "",
  },
  customCss: "",
}; 