import { usePplxCookiesStore } from "@/data/pplx-cookies-store";

export default function usePplxIncognitoMode(): boolean {
  const { cookies } = usePplxCookiesStore();

  const isIncognito = useMemo(
    () =>
      cookies.find((cookie) => cookie.name === "pplx.is-incognito")?.value ===
      "true",
    [cookies],
  );

  return isIncognito;
}
