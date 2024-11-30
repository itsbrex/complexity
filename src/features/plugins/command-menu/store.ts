import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

type CommandMenuStoreType = {
  open: boolean;
  setOpen: (value: boolean) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  filter: "threads" | "spaces" | null;
  setFilter: (value: "threads" | "spaces" | null) => void;
  closeCommandMenu: ({
    clearSearchValue,
    clearFilter,
  }?: {
    clearSearchValue?: boolean;
    clearFilter?: boolean;
  }) => void;
};

export const commandMenuStore = createWithEqualityFn<CommandMenuStoreType>()(
  subscribeWithSelector(
    immer(
      (set): CommandMenuStoreType => ({
        open: false,
        setOpen: (value) => set({ open: value }),
        searchValue: "",
        setSearchValue: (value) => set({ searchValue: value }),
        filter: null,
        setFilter: (value) => set({ filter: value }),
        closeCommandMenu: ({
          clearSearchValue = true,
          clearFilter = true,
        } = {}) => {
          set((state) => {
            state.open = false;
            if (clearSearchValue) state.searchValue = "";
            if (clearFilter) state.filter = null;
          });
        },
      }),
    ),
  ),
);

export const useCommandMenuStore = commandMenuStore;
