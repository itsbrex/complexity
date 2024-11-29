import { defineProxyService } from "@webext-core/proxy-service";

import { Theme } from "@/data/plugins/themes/theme-registry.types";
import { db } from "@/services/indexed-db/indexed-db";

class LocalThemesService {
  async add(theme: Theme): Promise<string> {
    return await db.themes.add(theme);
  }

  async get(id: string): Promise<Theme | undefined> {
    return await db.themes.get(id);
  }

  async getAll(): Promise<Theme[]> {
    return await db.themes.toArray();
  }

  async update(theme: Theme): Promise<string> {
    await db.themes.put(theme);
    return theme.id;
  }

  async delete(id: string): Promise<void> {
    await db.themes.delete(id);
  }
}

export const [registerLocalThemesService, getLocalThemesService] =
  defineProxyService("LocalThemesService", () => new LocalThemesService());
