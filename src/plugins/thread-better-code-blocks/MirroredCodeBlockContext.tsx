import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import useThreadCodeBlock from "@/plugins/_core/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";

type MirroredCodeBlockContext = ReturnType<typeof createStore>;

type MirroredCodeBlockStore = {
  sourceMessageBlockIndex: number;
  sourceCodeBlockIndex: number;
  isWrapped: boolean;
  setIsWrapped: (isWrapped: boolean) => void;
  maxHeight: number;
  setMaxHeight: (maxHeight: number) => void;
};

type InitialState = Omit<
  MirroredCodeBlockStore,
  "setIsWrapped" | "setMaxHeight"
>;

export const createStore = (initialState: InitialState) =>
  createWithEqualityFn<MirroredCodeBlockStore>()(
    subscribeWithSelector(
      immer(
        (set): MirroredCodeBlockStore => ({
          ...initialState,
          setIsWrapped: (isWrapped) => {
            set((state) => {
              state.isWrapped = isWrapped;
            });
          },
          setMaxHeight: (maxHeight) => {
            set((state) => {
              state.maxHeight = maxHeight;
            });
          },
        }),
      ),
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
    storeValue: InitialState;
    children: React.ReactNode;
  }) {
    const [store] = useState(() => createStore(storeValue));

    return (
      <MirroredCodeBlockContext.Provider value={store}>
        {children}
      </MirroredCodeBlockContext.Provider>
    );
  },
);

export function useMirroredCodeBlockContext() {
  const context = use(MirroredCodeBlockContext);
  if (!context) {
    throw new Error(
      "useMirroredCodeBlockContext must be used within a MirroredCodeBlockContext",
    );
  }

  const contextValues = context();

  return {
    codeBlock: useThreadCodeBlock({
      messageBlockIndex: contextValues.sourceMessageBlockIndex,
      codeBlockIndex: contextValues.sourceCodeBlockIndex,
    }),
    ...contextValues,
  };
}
