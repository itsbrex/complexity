import { defineProxyService } from "@webext-core/proxy-service";

import { PinnedSpace } from "@/data/plugins/space-navigator/pinned-space.types";
import { db } from "@/services/indexed-db/indexed-db";

class PinnedSpacesService {
  async add(theme: Omit<PinnedSpace, "createdAt">): Promise<string> {
    return await db.pinnedSpaces.add({
      ...theme,
      createdAt: new Date().getTime(),
    });
  }

  async get(uuid: PinnedSpace["uuid"]): Promise<PinnedSpace | undefined> {
    return await db.pinnedSpaces.get(uuid);
  }

  async getAll(): Promise<PinnedSpace[]> {
    return await db.pinnedSpaces.orderBy("createdAt").reverse().toArray();
  }

  async update(theme: PinnedSpace): Promise<string> {
    await db.pinnedSpaces.put(theme);
    return theme.uuid;
  }

  async delete(uuid: PinnedSpace["uuid"]): Promise<void> {
    await db.pinnedSpaces.delete(uuid);
  }
}

export const [registerPinnedSpacesService, getPinnedSpacesService] =
  defineProxyService("PinnedSpacesService", () => new PinnedSpacesService());
