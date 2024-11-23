import { memo } from "react";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { MirroredCodeBlock } from "@/features/plugins/thread/better-code-blocks/useMirroredCodeBlocks";
import { RemoveNull } from "@/types/utils.types";

type MirroredCodeBlockContext = ReturnType<typeof createStore>;

type NonNullMirroredCodeBlock = RemoveNull<
  MirroredCodeBlock,
  "lang" | "codeString"
>;

type MirroredCodeBlockStore = Pick<
  NonNullMirroredCodeBlock,
  "lang" | "codeString" | "isInFlight"
> & {
  sourceMessageBlockIndex: number;
  sourceCodeBlockIndex: number;
  isMessageBlockInFlight: boolean;
  codeElement: Element;
};

export const createStore = (initialState: MirroredCodeBlockStore) =>
  createWithEqualityFn<MirroredCodeBlockStore>()(
    subscribeWithSelector(
      immer(() => ({
        ...initialState,
      })),
    ),
  );

const MirroredCodeBlockContext = createContext<MirroredCodeBlockContext | null>(
  null,
);

export const MirroredCodeBlockContextProvider = memo(
  function MirroredCodeBlockContextProvider({
    storeValue,
    children,
  }: {
    storeValue: MirroredCodeBlockStore;
    children: React.ReactNode;
  }) {
    const store = useMemo(() => createStore(storeValue), [storeValue]);

    return (
      <MirroredCodeBlockContext.Provider value={store}>
        {children}
      </MirroredCodeBlockContext.Provider>
    );
  },
);

export function useMirroredCodeBlockContext() {
  const context = useContext(MirroredCodeBlockContext);
  if (!context) {
    throw new Error(
      "useMirroredCodeBlockContext must be used within a MirroredCodeBlockContext",
    );
  }
  return context;
}
