import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import {
  CommandMenuState,
  CommandMenuActions,
} from "@/data/plugins/command-menu/store/types";

const initialState: CommandMenuState = {
  open: false,
  inputRef: null,

  searchValue: "",
  selectedValue: "",

  filter: null,
  spacethreadFilterSlug: null,
  spacethreadTitle: null,
};

export const useCommandMenuStore = createWithEqualityFn<
  CommandMenuState & CommandMenuActions
>()(
  subscribeWithSelector(
    immer((set) => ({
      ...initialState,

      setOpen: (open) => set({ open }),
      setInputRef: (ref) => set({ inputRef: ref }),

      setSearchValue: (searchValue) => set({ searchValue }),
      setSelectedValue: (selectedValue) => set({ selectedValue }),

      setFilter: (filter) => set({ filter }),
      setSpacethreadFilterSlug: (slug) => set({ spacethreadFilterSlug: slug }),
      setSpacethreadTitle: (title) => set({ spacethreadTitle: title }),

      closeCommandMenu: () => set({ open: false }),

      reset: () => set(initialState),
    })),
  ),
);
