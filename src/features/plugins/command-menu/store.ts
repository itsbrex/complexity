import { RefObject } from "react";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { SearchFilter } from "@/features/plugins/command-menu/items";

type CommandMenuStoreType = {
  inputRef: RefObject<HTMLInputElement> | null;
  setInputRef: (value: RefObject<HTMLInputElement> | null) => void;
  open: boolean;
  setOpen: (value: boolean) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  filter: SearchFilter | null;
  setFilter: (value: SearchFilter | null) => void;
  spacethreadTitle: string | null;
  setSpacethreadTitle: (value: string | null) => void;
  spacethreadFilterSlug: string | null;
  setSpacethreadFilterSlug: (value: string | null) => void;
  closeCommandMenu: ({
    clearSearchValue,
    clearFilter,
    clearSpacethreadFilter,
  }?: {
    clearSearchValue?: boolean;
    clearFilter?: boolean;
    clearSpacethreadFilter?: boolean;
  }) => void;
};

export const commandMenuStore = createWithEqualityFn<CommandMenuStoreType>()(
  subscribeWithSelector(
    immer(
      (set): CommandMenuStoreType => ({
        inputRef: null,
        setInputRef: (value) => set({ inputRef: value }),
        open: false,
        setOpen: (value) => set({ open: value }),
        searchValue: "",
        setSearchValue: (value) => set({ searchValue: value }),
        filter: null,
        setFilter: (value) => set({ filter: value }),
        spacethreadFilterSlug: null,
        setSpacethreadFilterSlug: (value) =>
          set({ spacethreadFilterSlug: value }),
        spacethreadTitle: null,
        setSpacethreadTitle: (value) => set({ spacethreadTitle: value }),
        closeCommandMenu: ({
          clearSearchValue = true,
          clearFilter = true,
          clearSpacethreadFilter = true,
        } = {}) => {
          set((state) => ({
            open: false,
            searchValue: clearSearchValue ? "" : state.searchValue,
            filter: clearFilter ? null : state.filter,
            spacethreadFilterSlug: clearSpacethreadFilter
              ? null
              : state.spacethreadFilterSlug,
            spacethreadTitle: clearSpacethreadFilter
              ? null
              : state.spacethreadTitle,
          }));
        },
      }),
    ),
  ),
);

export const useCommandMenuStore = commandMenuStore;
