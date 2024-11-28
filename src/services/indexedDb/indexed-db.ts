import { Dexie } from "dexie";

import { Theme } from "@/data/consts/plugins/themes/theme-registry.types";

export class IndexedDbService extends Dexie {
  themes!: Dexie.Table<Theme, string>;

  constructor() {
    super("ComplexityDatabase");
    this.version(1).stores({
      themes: "&id, title, author",
    });
  }
}

export const db = new IndexedDbService();
