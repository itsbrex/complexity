import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

export type ScopedQueryBoxStore = {
  type: "main" | "follow-up";
};

const createScopedQueryBoxStore = (type: "main" | "follow-up") =>
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
export const followUpQueryBoxStore = createScopedQueryBoxStore("follow-up");
