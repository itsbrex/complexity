import i18n from "i18next";

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
    onboarding: any;
    plugins: any;
    "dashboard-plugins-data": any;
    "dashboard-plugins-page": any;
    "dashboard-themes-page": any;
    "dashboard-settings-page": any;
    "plugin-drag-n-drop-file-to-upload-in-thread": any;
    "plugin-export-thread": any;
    "plugin-better-copy-buttons": any;
    "plugin-better-code-blocks": any;
    "plugin-on-cloudflare-timeout-reload": any;
    "plugin-command-menu": any;
  };
};

async function loadLanguageResources(language: string) {
  return {
    common: await import(`~/src/locales/${language}/common.json`),
    onboarding: await import(`~/src/locales/${language}/onboarding.json`),
    plugins: await import(`~/src/locales/${language}/plugins.json`),
    "dashboard-plugins-data": await import(
      `~/src/locales/${language}/dashboard-plugins-data.json`
    ),
    "dashboard-plugins-page": await import(
      `~/src/locales/${language}/dashboard-plugins-page.json`
    ),
    "dashboard-themes-page": await import(
      `~/src/locales/${language}/dashboard-themes-page.json`
    ),
    "dashboard-settings-page": await import(
      `~/src/locales/${language}/dashboard-settings-page.json`
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
  };
}

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
      "onboarding",
      "plugins",
      "dashboard-plugins-data",
      "dashboard-plugins-page",
      "dashboard-themes-page",
      "dashboard-settings-page",
      "plugin-drag-n-drop-file-to-upload-in-thread",
      "plugin-export-thread",
      "plugin-better-copy-buttons",
      "plugin-better-code-blocks",
      "plugin-on-cloudflare-timeout-reload",
      "plugin-command-menu",
    ],
    resources,
  });
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
