import { setupBackgroundListeners } from "@/entrypoints/background/listeners";
import { getOptionsPageUrl } from "@/utils/utils";

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    chrome.tabs.create({ url: `${getOptionsPageUrl()}#/onboarding` });
  }
});

setupBackgroundListeners();
