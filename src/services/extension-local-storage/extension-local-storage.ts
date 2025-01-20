import { produce } from "immer";

import { csLoaderRegistry } from "@/services/cs-loader-registry";
import { ExtensionLocalStorageApi } from "@/services/extension-local-storage/extension-local-storage-api";
import {
  ExtensionLocalStorageSchema,
  ExtensionLocalStorage,
} from "@/services/extension-local-storage/extension-local-storage.types";
import {
  extensionLocalStorageQueries,
  invalidateExtensionLocalStorageDataQuery,
} from "@/services/extension-local-storage/query-keys";
import { DEFAULT_STORAGE } from "@/services/extension-local-storage/storage-defaults";
import {
  mergeUndefined,
  setPathToUndefined,
} from "@/services/extension-local-storage/utils";
import { isZodError } from "@/types/utils.types";
import { queryClient } from "@/utils/ts-query-client";
import { isInContentScript, whereAmI } from "@/utils/utils";
import packageJson from "~/package.json";

export class ExtensionLocalStorageService {
  public static initializeReactiveStore(): boolean {
    if (whereAmI() !== "unknown") {
      throw new Error(
        "Extension local storage can not be reactive in content scripts!",
      );
    }

    ExtensionLocalStorageApi.listen(() => {
      invalidateExtensionLocalStorageDataQuery();
    });

    return true;
  }

  public static async get(): Promise<ExtensionLocalStorage> {
    const settings = await queryClient.fetchQuery({
      ...extensionLocalStorageQueries.data,
      gcTime: isInContentScript() ? Infinity : undefined,
    });

    return settings;
  }

  public static getCachedSync(): ExtensionLocalStorage {
    const settings = ExtensionLocalStorageService.safeGetCachedSync();

    if (!settings) {
      throw new Error("Extension local storage is not initialized");
    }

    return settings;
  }

  public static safeGetCachedSync(): ExtensionLocalStorage | null {
    return (
      queryClient.getQueryData<ExtensionLocalStorage>(
        extensionLocalStorageQueries.data.queryKey,
      ) ?? null
    );
  }

  public static async set(
    updater: (draft: ExtensionLocalStorage) => void,
  ): Promise<ExtensionLocalStorage> {
    const isContentScript = isInContentScript();

    const currentSettings = isContentScript
      ? await ExtensionLocalStorageService.get()
      : (ExtensionLocalStorageService.safeGetCachedSync() ??
        (await ExtensionLocalStorageService.get()));

    const newSettings = produce(currentSettings, (draft) => {
      updater(draft);
    });

    await ExtensionLocalStorageApi.set(newSettings);

    // dont need to invalidate the query cache here because we've already listening to changes in initializeReactiveStore()

    return newSettings;
  }

  public static async exportAll(): Promise<ExtensionLocalStorage> {
    const settings = await ExtensionLocalStorageService.get();
    return settings;
  }

  public static async import(data: ExtensionLocalStorage): Promise<void> {
    await ExtensionLocalStorageApi.set(
      await mergeData(data, await ExtensionLocalStorageService.get()),
    );
  }

  public static async clearAll(): Promise<void> {
    await ExtensionLocalStorageApi.set(DEFAULT_STORAGE);
  }
}

async function parseStoreData(
  rawSettings: ExtensionLocalStorage,
): Promise<ExtensionLocalStorage> {
  return mergeData(rawSettings, DEFAULT_STORAGE);
}

async function mergeData(
  rawSettings: ExtensionLocalStorage,
  defaultSettings: ExtensionLocalStorage,
): Promise<ExtensionLocalStorage> {
  // we dont return the validated settings because we want to keep the unspecified keys on the new schema

  const { error } = ExtensionLocalStorageSchema.safeParse(rawSettings);

  if (error) {
    if (!isZodError(error)) {
      return DEFAULT_STORAGE;
    }

    console.log("[Cplx] Settings schema mismatch, merging with defaults...");

    let cleanSettings = rawSettings;

    error.issues.forEach((issue) => {
      cleanSettings = setPathToUndefined({
        paths: issue.path as string[],
        obj: cleanSettings,
      }) as ExtensionLocalStorage;
    });

    const updatedSettings = mergeUndefined({
      target: cleanSettings,
      source: defaultSettings,
    });

    updatedSettings.schemaVersion = packageJson.version;

    ExtensionLocalStorageSchema.parse(updatedSettings);

    await ExtensionLocalStorageApi.set(updatedSettings);

    return updatedSettings;
  }

  return rawSettings;
}

export async function fetchExtensionLocalStorageData(): Promise<ExtensionLocalStorage> {
  return parseStoreData(await ExtensionLocalStorageApi.get());
}

csLoaderRegistry.register({
  id: "cache:extensionLocalStorage",
  loader: async () => {
    await ExtensionLocalStorageService.get();
  },
});
