import type { BundledTheme } from "shiki";
import { z } from "zod";

export const BetterCodeBlockGlobalOptionsSchema = z.object({
  stickyHeader: z.boolean(),
  theme: z.object({
    enabled: z.boolean(),
    light: z.string().transform((val): BundledTheme => val as BundledTheme),
    dark: z.string().transform((val): BundledTheme => val as BundledTheme),
  }),
  unwrap: z.object({
    enabled: z.boolean(),
    showToggleButton: z.boolean(),
  }),
  maxHeight: z.object({
    enabled: z.boolean(),
    value: z.number(),
    showToggleButton: z.boolean(),
  }),
});

export type BetterCodeBlockGlobalOptions = z.infer<
  typeof BetterCodeBlockGlobalOptionsSchema
>;

export const BetterCodeBlockFineGrainedOptionsSchema =
  BetterCodeBlockGlobalOptionsSchema.extend({
    language: z.string(),
    placeholderText: z.object({
      enabled: z.boolean(),
      title: z.string(),
      idle: z.string(),
      loading: z.string(),
    }),
  });

export type BetterCodeBlockFineGrainedOptions = z.infer<
  typeof BetterCodeBlockFineGrainedOptionsSchema
>;
