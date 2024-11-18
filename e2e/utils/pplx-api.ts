import { Page } from "@playwright/test";

import { ENDPOINTS } from "@/services/pplx-api/endpoints";
import { UserSettingsApiResponseSchema } from "@/services/pplx-api/pplx-api.types";

export type AuthSession = {
  user: {
    name: string;
    email: string;
    image: string;
    id: string;
    username: string;
    subscription_status: string;
    subscription_source: string;
  };
  expires: string;
  preventUsernameRedirect: boolean;
};

export async function fetchPplxAuthSession(page: Page) {
  const resp = await page.request.get(ENDPOINTS.AUTH_SESSION);
  return (await resp.json()) as AuthSession;
}

export async function fetchPplxUserSettings(page: Page) {
  const resp = await page.request.get(ENDPOINTS.USER_SETTINGS);
  return UserSettingsApiResponseSchema.parse(await resp.json());
}
