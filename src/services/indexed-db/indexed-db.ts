import { Dexie } from "dexie";

import { BetterCodeBlockFineGrainedOptions } from "@/data/dashboard/better-code-blocks/better-code-blocks-options.types";
import { ExtensionData } from "@/data/dashboard/extension-data.types";
import { PromptHistory } from "@/data/plugins/prompt-history/prompt-history.type";
import { Theme } from "@/data/plugins/themes/theme-registry.types";

export class IndexedDbService extends Dexie {
  themes!: Dexie.Table<Theme, string>;
  betterCodeBlocks!: Dexie.Table<BetterCodeBlockFineGrainedOptions, string>;
  promptHistory!: Dexie.Table<PromptHistory, string>;

  constructor() {
    super("ComplexityDatabase");
    this.version(1).stores({
      themes: "&id, title, author",
      betterCodeBlocks: "&language",
    });

    this.version(2).stores({
      promptHistory: "&id, prompt, createdAt",
    });
  }

  async exportAll(): Promise<ExtensionData["db"]> {
    const themes = await this.themes.toArray();
    const betterCodeBlocksFineGrainedOptions =
      await this.betterCodeBlocks.toArray();
    const promptHistory = await this.promptHistory.toArray();
    return { themes, betterCodeBlocksFineGrainedOptions, promptHistory };
  }

  async import(data: ExtensionData["db"]) {
    await this.themes.bulkPut(data.themes);
    await this.betterCodeBlocks.bulkPut(
      data.betterCodeBlocksFineGrainedOptions,
    );
    await this.promptHistory.bulkPut(data.promptHistory);
  }

  async clearAll() {
    await this.themes.clear();
    await this.betterCodeBlocks.clear();
    await this.promptHistory.clear();
  }
}

export const db = new IndexedDbService();
