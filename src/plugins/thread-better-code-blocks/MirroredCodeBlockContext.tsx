import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { MirroredCodeBlock } from "@/plugins/thread-better-code-blocks/store";
import { RemoveNull } from "@/types/utils.types";

type MirroredCodeBlockContext = ReturnType<typeof createStore>;

type NonNullMirroredCodeBlock = RemoveNull<
  MirroredCodeBlock,
  "language" | "codeString"
>;

type MirroredCodeBlockStore = Pick<
  NonNullMirroredCodeBlock,
  "language" | "codeString" | "isInFlight"
> & {
  sourceMessageBlockIndex: number;
  sourceCodeBlockIndex: number;
  isMessageBlockInFlight: boolean;
  codeElement: Element;
  isWrapped: boolean;
  setIsWrapped: (isWrapped: boolean) => void;
  maxHeight: number;
  setMaxHeight: (maxHeight: number) => void;
};

type InitialState = Omit<
  MirroredCodeBlockStore,
  "setIsWrapped" | "setMaxHeight" | "setContent"
>;

export const createStore = (initialState: InitialState) =>
  createWithEqualityFn<MirroredCodeBlockStore>()(
    subscribeWithSelector(
      immer((set) => ({
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
    storeValue: InitialState;
    children: React.ReactNode;
  }) {
    const [store] = useState(() => createStore(storeValue));

    useEffect(() => {
      store.setState(storeValue);
    }, [store, storeValue]);

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
  return context;
}
