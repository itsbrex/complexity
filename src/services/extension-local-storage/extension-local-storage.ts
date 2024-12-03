import { produce } from "immer";

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
import { whereAmI } from "@/utils/utils";
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
      gcTime: whereAmI() === "unknown" ? undefined : Infinity, // always keep the data in memory in content scripts
    });

    return settings;
  }

  public static getCachedSync(): ExtensionLocalStorage {
    const settings = queryClient.getQueryData<ExtensionLocalStorage>(
      extensionLocalStorageQueries.data.queryKey,
    );

    if (!settings) {
      throw new Error("Extension local storage is not initialized");
    }

    return settings;
  }

  public static async set(
    updater: (draft: ExtensionLocalStorage) => void,
  ): Promise<ExtensionLocalStorage> {
    const currentSettings = ExtensionLocalStorageService.getCachedSync();

    const newSettings = produce(currentSettings, (draft) => {
      updater(draft);
    });

    await ExtensionLocalStorageApi.set(newSettings);

    // invalidateExtensionLocalStorageDataQuery();

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
  const { data: validatedSettings, error } =
    ExtensionLocalStorageSchema.safeParse(rawSettings);

  if (error) {
    if (!isZodError(error)) {
      return DEFAULT_STORAGE;
    }

    console.log("[Cplx] Settings schema mismatch, merging...");

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

    const validatedSettings =
      ExtensionLocalStorageSchema.parse(updatedSettings);

    await ExtensionLocalStorageApi.set(validatedSettings);

    return validatedSettings;
  }

  return validatedSettings;
}

export async function fetchExtensionLocalStorageData(): Promise<ExtensionLocalStorage> {
  return parseStoreData(await ExtensionLocalStorageApi.get());
}
