import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

export type ScopedQueryBoxStore = {
  type: "main" | "modal" | "space" | "follow-up";
};

const createScopedQueryBoxStore = (type: ScopedQueryBoxStore["type"]) =>
  createWithEqualityFn<ScopedQueryBoxStore>()(
    subscribeWithSelector(
      immer(
        (set, get): ScopedQueryBoxStore => ({
          type,
        }),
      ),
    ),
  );

export const mainQueryBoxStore = createScopedQueryBoxStore("main");

export const modalQueryBoxStore = createScopedQueryBoxStore("modal");

export const followUpQueryBoxStore = createScopedQueryBoxStore("follow-up");

export const spaceQueryBoxStore = createScopedQueryBoxStore("space");
