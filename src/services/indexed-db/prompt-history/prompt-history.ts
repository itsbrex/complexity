import { defineProxyService } from "@webext-core/proxy-service";
import { nanoid } from "nanoid";

import { PromptHistory } from "@/data/plugins/prompt-history/prompt-history.type";
import { db } from "@/services/indexed-db/indexed-db";

class PromptHistoryService {
  async add(prompt: string): Promise<string> {
    return await db.promptHistory.add({
      prompt,
      id: new Date().getTime().toString() + "-" + nanoid(),
      createdAt: new Date().getTime(),
    });
  }

  async deduplicateAdd(prompt: string): Promise<string> {
    const mostRecentItem = await db.promptHistory.reverse().first();
    if (mostRecentItem?.prompt === prompt) {
      // update "createdAt" to now
      await db.promptHistory.update(mostRecentItem.id, {
        createdAt: new Date().getTime(),
      });
      return mostRecentItem.id;
    }
    return await this.add(prompt);
  }

  async deleteAll(): Promise<void> {
    await db.promptHistory.clear();
  }

  async get(id: string): Promise<PromptHistory | undefined> {
    return await db.promptHistory.get(id);
  }

  async getAll(): Promise<PromptHistory[]> {
    return await db.promptHistory.reverse().toArray();
  }

  async getPaginatedItems({
    searchTerm = "",
    limit = 10,
    offset = 0,
  }: {
    searchTerm?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ items: PromptHistory[]; total: number }> {
    const collection = db.promptHistory.orderBy("createdAt").filter((item) => {
      if (!searchTerm) return true;
      return item.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const total = await collection.count();

    const items = await collection
      .reverse()
      .offset(offset)
      .limit(limit)
      .toArray();

    return { items, total };
  }

  async update(promptHistory: PromptHistory): Promise<string> {
    await db.promptHistory.put(promptHistory);
    return promptHistory.id;
  }

  async delete(id: string): Promise<void> {
    await db.promptHistory.delete(id);
  }
}

export const [registerPromptHistoryService, getPromptHistoryService] =
  defineProxyService("PromptHistoryService", () => new PromptHistoryService());
