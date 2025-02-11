import { defineProxyService } from "@webext-core/proxy-service";
import { produce } from "immer";
import merge from "lodash/merge";
import { DeepPartial } from "react-hook-form";

import { BetterCodeBlockFineGrainedOptions } from "@/data/dashboard/better-code-blocks/better-code-blocks-options.types";
import { db } from "@/services/indexed-db";
import { betterCodeBlocksFineGrainedOptionsQueries } from "@/services/indexed-db/better-code-blocks/query-keys";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { queryClient } from "@/utils/ts-query-client";

class BetterCodeBlocksFineGrainedService {
  async add(options: BetterCodeBlockFineGrainedOptions): Promise<string> {
    return await db.betterCodeBlocks.add(options);
  }

  async get(
    language: string,
  ): Promise<BetterCodeBlockFineGrainedOptions | null> {
    return (await db.betterCodeBlocks.get(language)) ?? null;
  }

  async getAll(): Promise<BetterCodeBlockFineGrainedOptions[]> {
    return await db.betterCodeBlocks.toArray();
  }

  async update(options: BetterCodeBlockFineGrainedOptions): Promise<string> {
    await db.betterCodeBlocks.put(options);
    return options.language;
  }

  async updateDraft({
    language,
    newDraft,
  }: {
    language: string;
    newDraft: DeepPartial<BetterCodeBlockFineGrainedOptions>;
  }): Promise<string> {
    const currentSettings = await this.get(language);

    if (!currentSettings) {
      throw new Error("Language not found");
    }

    const newSettings: BetterCodeBlockFineGrainedOptions = produce(
      currentSettings,
      (draft) => {
        return merge(draft, newDraft);
      },
    );

    await db.betterCodeBlocks.update(language, newSettings);
    return language;
  }

  async delete(language: string): Promise<void> {
    await db.betterCodeBlocks.delete(language);
  }
}

export const [
  registerBetterCodeBlocksFineGrainedOptionsService,
  getBetterCodeBlocksFineGrainedOptionsService,
] = defineProxyService(
  "BetterCodeBlocksFineGrainedOptionsService",
  () => new BetterCodeBlocksFineGrainedService(),
);

csLoaderRegistry.register({
  id: "cache:betterCodeBlocksFineGrainedOptions",
  dependencies: ["cache:pluginsStates"],
  loader: async () => {
    const pluginsEnableStates =
      PluginsStatesService.getEnableStatesCachedSync();

    if (!pluginsEnableStates["thread:betterCodeBlocks"]) return;

    await queryClient.prefetchQuery({
      ...betterCodeBlocksFineGrainedOptionsQueries.list,
      gcTime: Infinity,
    });
  },
});
