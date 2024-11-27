import { z } from "zod";

export const ThemeSchema = z.object({
  id: z.string().refine((id) => /^[a-zA-Z0-9-]+$/.test(id), {
    message: "Must only contains a-z, A-Z, 0-9, and -",
  }),
  label: z.string(),
  description: z.string(),
  featuredImage: z.string().optional(),
  author: z.string(),
  isBuiltIn: z.boolean(),
  compatibleWith: z.array(z.enum(["desktop", "mobile"])),
  colorScheme: z.array(z.enum(["light", "dark"])),
  css: z.function().returns(z.promise(z.string())),
});

export type Theme = z.infer<typeof ThemeSchema>;
