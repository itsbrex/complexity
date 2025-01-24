import { subscribeWithSelector } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";

import { ExtendedCodeBlock } from "@/plugins/_api/dom-observer/global-dom-observer-store";

export type MirroredCodeBlock = ExtendedCodeBlock & {
  portalContainer: HTMLElement | null;
  codeString: string | null;
  language: string | null;
};

type MirroredCodeBlocksStoreType = {
  blocks: MirroredCodeBlock[][];
  setBlocks: (blocks: MirroredCodeBlock[][]) => void;
};

export const mirroredCodeBlocksStore =
  createWithEqualityFn<MirroredCodeBlocksStoreType>()(
    subscribeWithSelector(
      (set): MirroredCodeBlocksStoreType => ({
        blocks: [],
        setBlocks: (blocks) => set({ blocks }),
      }),
    ),
  );

export const useMirroredCodeBlocksStore = mirroredCodeBlocksStore;

export function getMirroredCodeBlockByLocation({
  mirroredCodeBlocks,
  messageBlockIndex,
  codeBlockIndex,
}: {
  mirroredCodeBlocks: MirroredCodeBlock[][];
  messageBlockIndex?: number;
  codeBlockIndex?: number;
}) {
  if (messageBlockIndex == null || codeBlockIndex == null) return null;

  if (
    mirroredCodeBlocks[messageBlockIndex] == null ||
    mirroredCodeBlocks[messageBlockIndex][codeBlockIndex] == null
  )
    return null;

  return mirroredCodeBlocks[messageBlockIndex][codeBlockIndex];
}
