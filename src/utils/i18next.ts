import i18n from "i18next";

import { whereAmI } from "@/utils/utils";

const supportedLangs = [
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
  "vi-VN",
] as const;

const language = await getLanguage();

type Resources = {
  [key: string]: {
    common: any;
    onboarding: any;
    plugins: any;
  };
};

const resources: Resources = {
  [language]: {
    common: await import(`~/src/locales/${language}/common.json`),
    onboarding: await import(`~/src/locales/${language}/onboarding.json`),
    plugins: await import(`~/src/locales/${language}/plugins.json`),
  },
};

await i18n.init({
  lng: language,
  fallbackLng: "en-US",
  defaultNS: "common",
  ns: ["common", "onboarding", "plugins"],
  resources,
});

export async function getLanguage() {
  let pplxLang = "en-US";

  switch (whereAmI()) {
    case "unknown":
      if (
        await chrome.permissions.contains({
          permissions: ["cookies"],
        })
      ) {
        pplxLang =
          (
            await chrome.cookies.get({
              name: "pplx.chosen-locale",
              url: "https://www.perplexity.ai",
            })
          )?.value ||
          navigator.language ||
          "en-US";
      }
      break;
    default:
      pplxLang =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("pplx.chosen-locale="))
          ?.split("=")[1] ||
        navigator.language ||
        "en-US";
  }

  if (supportedLangs.includes(pplxLang as (typeof supportedLangs)[number])) {
    return pplxLang;
  }

  return "en-US";
}

export const t = i18n.t;

export { i18n };
