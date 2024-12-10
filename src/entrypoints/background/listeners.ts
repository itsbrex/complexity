import { APP_CONFIG } from "@/app.config";
import { getOptionsPageUrl } from "@/utils/utils";

export function setupBackgroundListeners() {
  // if (APP_CONFIG.IS_DEV) {
  //   chrome.runtime.onInstalled.addListener(() => {
  //     chrome.tabs.create({
  //       url: getOptionsPageUrl(),
  //     });
  //   });
  // }

  chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: "https://perplexity.ai/" });
  });

  chrome.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === "install") {
      chrome.tabs.create({ url: `${getOptionsPageUrl()}#/onboarding` });
    }
  });

  createDashboardShortcut();
}

function createDashboardShortcut() {
  chrome.contextMenus.removeAll();

  chrome.contextMenus.create({
    id: "openOptionsPage",
    title: "Dashboard",
    contexts: ["action"],
  });

  chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "openOptionsPage") {
      chrome.tabs.create({ url: getOptionsPageUrl() });
    }
  });
}
