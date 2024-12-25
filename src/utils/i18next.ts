import i18n from "i18next";

import { CsLoaderRegistry } from "@/services/cs-loader-registry";
import { whereAmI } from "@/utils/utils";

export type SupportedLangs = (typeof supportedLangs)[number];

export const supportedLangs = [
  "en-US",
  "fr-FR",
  "de-DE",
  "ja-JP",
  "ko-KR",
  "zh-CN",
  "es-ES",
  "hi-IN",
  "it-IT",
  "pt-BR",
  "cs-CZ",
  "hr-HR",
  "hu-HU",
  "pl-PL",
  "pt-PT",
  "sk-SK",
  "mk-MK",
  "sr-Cyrl-ME",
] as const;

type Resources = {
  [key: string]: {
    common: any;
    "plugin-focus-selector": any;
    "plugin-model-selectors": any;
    "plugin-drag-n-drop-file-to-upload-in-thread": any;
    "plugin-export-thread": any;
    "plugin-better-copy-buttons": any;
    "plugin-better-code-blocks": any;
    "plugin-on-cloudflare-timeout-reload": any;
    "plugin-command-menu": any;
    "plugin-slash-command-menu": any;
    "plugin-space-navigator": any;
  };
};

async function loadLanguageResources(language: string) {
  return {
    common: await import(`~/src/locales/${language}/common.json`),
    "plugin-focus-selector": await import(
      `~/src/locales/${language}/plugin-focus-selector.json`
    ),
    "plugin-model-selectors": await import(
      `~/src/locales/${language}/plugin-model-selectors.json`
    ),
    "plugin-drag-n-drop-file-to-upload-in-thread": await import(
      `~/src/locales/${language}/plugin-drag-n-drop-file-to-upload-in-thread.json`
    ),
    "plugin-export-thread": await import(
      `~/src/locales/${language}/plugin-export-thread.json`
    ),
    "plugin-better-copy-buttons": await import(
      `~/src/locales/${language}/plugin-better-copy-buttons.json`
    ),
    "plugin-better-code-blocks": await import(
      `~/src/locales/${language}/plugin-better-code-blocks.json`
    ),
    "plugin-on-cloudflare-timeout-reload": await import(
      `~/src/locales/${language}/plugin-on-cloudflare-timeout-reload.json`
    ),
    "plugin-command-menu": await import(
      `~/src/locales/${language}/plugin-command-menu.json`
    ),
    "plugin-slash-command-menu": await import(
      `~/src/locales/${language}/plugin-slash-command-menu.json`
    ),
    "plugin-space-navigator": await import(
      `~/src/locales/${language}/plugin-space-navigator.json`
    ),
  };
}

async function getCookieLocale(
  isExtension: boolean,
): Promise<string | undefined> {
  if (isExtension) {
    if (await chrome.permissions.contains({ permissions: ["cookies"] })) {
      const cookie = await chrome.cookies.get({
        name: "pplx.chosen-locale",
        url: "https://www.perplexity.ai",
      });
      return cookie?.value;
    }
  } else {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("pplx.chosen-locale="))
      ?.split("=")[1];
  }
}

export async function getLanguage() {
  const isExtension = whereAmI() === "unknown";
  const cookieLocale = await getCookieLocale(isExtension);
  const pplxLang = cookieLocale || navigator.language || "en-US";

  return supportedLangs.includes(pplxLang as SupportedLangs)
    ? pplxLang
    : "en-US";
}

export const t = i18n.t;

export { i18n };

export async function initializeI18next() {
  const language = await getLanguage();

  const resources: Resources = {
    [language]: await loadLanguageResources(language),
  };

  if (language !== "en-US") {
    resources["en-US"] = await loadLanguageResources("en-US");
  }

  await i18n.init({
    lng: language,
    fallbackLng: "en-US",
    defaultNS: "common",
    ns: [
      "common",
      "plugin-focus-selector",
      "plugin-model-selectors",
      "plugin-drag-n-drop-file-to-upload-in-thread",
      "plugin-export-thread",
      "plugin-better-copy-buttons",
      "plugin-better-code-blocks",
      "plugin-on-cloudflare-timeout-reload",
      "plugin-command-menu",
      "plugin-slash-command-menu",
      "plugin-space-navigator",
    ],
    resources,
  });
}

CsLoaderRegistry.register({
  id: "lib:i18next",
  loader: initializeI18next,
});
