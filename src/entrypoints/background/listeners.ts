import { onMessage } from "webext-bridge/background";

import { getOptionsPageUrl } from "@/utils/utils";

export type BackgroundEvents = {
  "bg:get-tab-id": () => number;
};

export function setupBackgroundListeners() {
  chrome.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === "install") {
      chrome.tabs.create({ url: `${getOptionsPageUrl()}#/onboarding` });
    }
  });

  onMessage("bg:get-tab-id", ({ sender }) => {
    return sender.tabId;
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
