import type { BundledLanguage } from "shiki";

export const INTERPRETED_LANGUAGE_CODE = {
  xml: "html",
  objectivec: "objective-c",
  assembly: "asm",
} as const satisfies Record<string, BundledLanguage>;

export type InterpretedLanguageCode = keyof typeof INTERPRETED_LANGUAGE_CODE;

export function isInterpretedLanguageCode(
  language: string,
): language is InterpretedLanguageCode {
  return language in INTERPRETED_LANGUAGE_CODE;
}
