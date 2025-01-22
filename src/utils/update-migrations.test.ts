import { produce } from "immer";
import { describe, it, expect, vi } from "vitest";

import { ExtensionLocalStorage } from "@/services/extension-local-storage/extension-local-storage.types";
import { DEFAULT_STORAGE } from "@/services/extension-local-storage/storage-defaults";
import {
  enableThemePreloader,
  migrateSlashCommandMenuKey,
  migrateSpaceNavigatorKey,
  migrateShowPostUpdateReleaseNotesPopup,
} from "@/utils/update-migrations";

describe("migrateShowPostUpdateReleaseNotesPopup", () => {
  it("should migrate doNotShowPostUpdateReleaseNotesPopup to false", async () => {
    const oldRawSettings: ExtensionLocalStorage = DEFAULT_STORAGE;

    const newSettings = await migrateShowPostUpdateReleaseNotesPopup({
      oldRawSettings,
    });

    expect(newSettings.showPostUpdateReleaseNotesPopup).toBe(false);
  });
});

describe("migrateSlashCommandMenuKey", () => {
  it("should migrate slash command menu key", async () => {
    const oldRawSettings: ExtensionLocalStorage = produce(
      DEFAULT_STORAGE,
      (draft) => {
        Object.keys(draft.plugins).forEach((key) => {
          const pluginIdKey = key as keyof typeof draft.plugins;
          switch (pluginIdKey) {
            case "queryBox:slashCommandMenu":
              delete (draft.plugins as any)[pluginIdKey];
              break;
            case "queryBox:slashCommandMenu:promptHistory":
              draft.plugins[pluginIdKey].enabled = true;
              break;
          }
        });
      },
    );

    const newSettings = await migrateSlashCommandMenuKey({
      oldRawSettings,
    });

    expect(newSettings.plugins["queryBox:slashCommandMenu"].enabled).toBe(true);
  });
});

describe("migrateSpaceNavigatorKey", () => {
  it("should migrate space navigator key", async () => {
    const oldRawSettings: ExtensionLocalStorage = produce(
      DEFAULT_STORAGE,
      (draft) => {
        (draft.plugins as any)["queryBox:spaceNavigator"] = {
          enabled: true,
        };
      },
    );

    const newSettings = await migrateSpaceNavigatorKey({
      oldRawSettings,
    });

    expect(newSettings.plugins.spaceNavigator).toEqual({
      enabled: true,
    });
    expect(
      (newSettings.plugins as any)["queryBox:spaceNavigator"],
    ).toBeUndefined();
  });
});

describe("enableThemePreloader", () => {
  it("should enable theme preloader when permissions are granted", async () => {
    const mockChrome = {
      permissions: {
        contains: vi.fn().mockResolvedValue(true),
      },
    };
    global.chrome = mockChrome as any;

    const oldRawSettings: ExtensionLocalStorage = DEFAULT_STORAGE;

    const newSettings = await enableThemePreloader({
      oldRawSettings,
    });

    expect(newSettings.preloadTheme).toBe(true);
  });

  it("should not enable theme preloader when permissions are not granted", async () => {
    const mockChrome = {
      permissions: {
        contains: vi.fn().mockResolvedValue(false),
      },
    };
    global.chrome = mockChrome as any;

    const oldRawSettings: ExtensionLocalStorage = DEFAULT_STORAGE;

    const newSettings = await enableThemePreloader({
      oldRawSettings,
    });

    expect(newSettings.preloadTheme).toBe(false);
  });
});
