import { Dexie } from "dexie";

import { BetterCodeBlockFineGrainedOptions } from "@/data/dashboard/better-code-blocks/better-code-blocks-options.types";
import { Theme } from "@/data/plugins/themes/theme-registry.types";

export class IndexedDbService extends Dexie {
  themes!: Dexie.Table<Theme, string>;
  betterCodeBlocks!: Dexie.Table<BetterCodeBlockFineGrainedOptions, string>;

  constructor() {
    super("ComplexityDatabase");
    this.version(1).stores({
      themes: "&id, title, author",
      betterCodeBlocks: "&language",
    });
  }
}

export const db = new IndexedDbService();
