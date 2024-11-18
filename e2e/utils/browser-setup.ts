import { chromium, BrowserContext } from "@playwright/test";

import { E2E_CONFIG } from "../config";

type SetupBrowserOptions = {
  testId: string;
  headless: boolean;
  cookies: Parameters<BrowserContext["addCookies"]>[0];
};

export async function setupBrowser({
  testId,
  headless,
  cookies,
}: SetupBrowserOptions): Promise<BrowserContext> {
  const uniqueUserDataDir = `${E2E_CONFIG.TEMP_CHROME_INSTANCES_DIR}/${testId}`;

  const launchOptions = {
    headless,
    executablePath: E2E_CONFIG.CHROME_PATH,
    args: [
      `--disable-extensions-except=${E2E_CONFIG.EXTENSION_PATH}`,
      `--load-extension=${E2E_CONFIG.EXTENSION_PATH}`,
    ],
  } satisfies Parameters<typeof chromium.launchPersistentContext>[1];

  const context = await chromium.launchPersistentContext(
    uniqueUserDataDir,
    launchOptions,
  );

  if (cookies.length > 0) {
    await context.addCookies(cookies);
  }

  return context;
}
