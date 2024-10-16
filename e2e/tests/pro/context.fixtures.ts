import { test as baseTest, BrowserContext, Page } from "@playwright/test";
import { nanoid } from "nanoid";

import { E2E_CONFIG } from "~/e2e/config";
import { setupBrowser } from "~/e2e/utils/browser-setup";

import { cookies } from "./pro-account";

type TestFixtures = {
  context: BrowserContext;
  page: Page;
};

type TestOptions = {
  headless: boolean;
};

export const test = baseTest.extend<TestFixtures, TestOptions>({
  headless: [E2E_CONFIG.HEADLESS, { scope: "worker" }],
  context: async ({ headless }, use) => {
    const context: BrowserContext = await setupBrowser({
      testId: nanoid(),
      headless,
      cookies,
    });
    await use(context);
    await context.close();
  },
});
