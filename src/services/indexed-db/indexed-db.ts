import { Dexie } from "dexie";

import { BetterCodeBlockFineGrainedOptions } from "@/data/dashboard/better-code-blocks/better-code-blocks-options.types";
import { ExtensionData } from "@/data/dashboard/extension-data.types";
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

  async exportAll(): Promise<ExtensionData["db"]> {
    const themes = await this.themes.toArray();
    const betterCodeBlocksFineGrainedOptions =
      await this.betterCodeBlocks.toArray();
    return { themes, betterCodeBlocksFineGrainedOptions };
  }

  async import(data: ExtensionData["db"]) {
    await this.themes.bulkPut(data.themes);
    await this.betterCodeBlocks.bulkPut(
      data.betterCodeBlocksFineGrainedOptions,
    );
  }

  async clearAll() {
    await this.themes.clear();
    await this.betterCodeBlocks.clear();
  }
}

export const db = new IndexedDbService();
