import { expect } from "@playwright/test";

import { AuthSession, fetchPplxAuthSession } from "../utils/pplx-api";

import { BasePage } from "./base.page";

export class AuthPage extends BasePage {
  async verifyIsLoggedIn(isPro: boolean): Promise<void> {
    const authSession = await this.fetchPplxAuthSession();

    console.log(authSession);

    expect(authSession.user.id).not.toBeNull();
    expect(authSession.user.subscription_status).toBe(
      isPro ? "active" : "none",
    );
  }

  private async fetchPplxAuthSession(): Promise<AuthSession> {
    return await fetchPplxAuthSession(this.page);
  }
}
