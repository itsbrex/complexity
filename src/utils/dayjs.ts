import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

import { getLanguage, SupportedLangs } from "@/utils/i18next";

const LANGUAGE_CODES: Record<SupportedLangs, string> = {
  "en-US": "en",
  "fr-FR": "fr",
  "de-DE": "de",
  "ja-JP": "ja",
  "ko-KR": "ko",
  "zh-CN": "zh-cn",
  "es-ES": "es",
  "hi-IN": "hi",
  "it-IT": "it",
  "pt-BR": "pt-br",
  "cs-CZ": "cs",
  "hr-HR": "hr",
  "hu-HU": "hu",
  "pl-PL": "pl",
  "pt-PT": "pt",
  "sk-SK": "sk",
  "mk-MK": "mk",
  "sr-Cyrl-ME": "sr",
};

const IMPORT_MAP: Record<SupportedLangs, () => Promise<unknown>> = {
  "en-US": () => import("dayjs/locale/en"),
  "fr-FR": () => import("dayjs/locale/fr"),
  "de-DE": () => import("dayjs/locale/de"),
  "ja-JP": () => import("dayjs/locale/ja"),
  "ko-KR": () => import("dayjs/locale/ko"),
  "zh-CN": () => import("dayjs/locale/zh-cn"),
  "es-ES": () => import("dayjs/locale/es"),
  "hi-IN": () => import("dayjs/locale/hi"),
  "it-IT": () => import("dayjs/locale/it"),
  "pt-BR": () => import("dayjs/locale/pt-br"),
  "cs-CZ": () => import("dayjs/locale/cs"),
  "hr-HR": () => import("dayjs/locale/hr"),
  "hu-HU": () => import("dayjs/locale/hu"),
  "pl-PL": () => import("dayjs/locale/pl"),
  "pt-PT": () => import("dayjs/locale/pt"),
  "sk-SK": () => import("dayjs/locale/sk"),
  "mk-MK": () => import("dayjs/locale/mk"),
  "sr-Cyrl-ME": () => import("dayjs/locale/sr"),
};

dayjs.extend(utc);
dayjs.extend(relativeTime);

export async function initializeDayjsLocale() {
  let language = await getLanguage();

  if (!LANGUAGE_CODES[language as SupportedLangs]) {
    language = "en-US";
  }

  await IMPORT_MAP[language as SupportedLangs]?.();
  dayjs.locale(LANGUAGE_CODES[language as SupportedLangs]);
}

export function formatHowLongAgo(date: string) {
  return dayjs.utc(date).local().fromNow();
}
