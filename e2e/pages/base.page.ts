import { Page } from "@playwright/test";

export class BasePage {
  constructor(protected page: Page) {}

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: "networkidle" });
  }
}
