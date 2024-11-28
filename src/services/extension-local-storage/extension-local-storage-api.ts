import { ExtensionLocalStorage } from "@/services/extension-local-storage/extension-local-storage.types";

export class ExtensionLocalStorageApi {
  static async get(): Promise<ExtensionLocalStorage> {
    return (await chrome.storage.local.get()) as ExtensionLocalStorage;
  }
  static async set(store: ExtensionLocalStorage) {
    await chrome.storage.local.set(store);
  }

  static async listen(callback: () => void) {
    chrome.storage.local.onChanged.addListener(() => {
      callback();
    });
  }
}
