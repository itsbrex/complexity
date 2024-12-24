import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import {
  FILTER_ITEMS,
  FilterMode,
} from "@/features/plugins/query-box/slash-command-menu/filter-items";
import UiUtils from "@/utils/UiUtils";

type SlashCommandMenuStore = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  filter: FilterMode | null;
  setFilter: (filter: FilterMode | null) => void;
  queryBoxAction: {
    insertTextAtCaret: (text: string) => void;
    deleteTriggerWord: () => void;
    clearSearchValue: () => void;
  };
};

export const useSlashCommandMenuStore =
  createWithEqualityFn<SlashCommandMenuStore>()(
    subscribeWithSelector(
      immer(
        (set, get): SlashCommandMenuStore => ({
          isOpen: false,
          setIsOpen: (isOpen) => {
            if (isOpen) {
              return set({
                searchValue: "",
                filter: null,
                isOpen,
                selectedValue: FILTER_ITEMS[0]?.command ?? "",
              });
            }

            set({
              isOpen,
            });
          },
          selectedValue: "",
          setSelectedValue: (value) => set({ selectedValue: value }),
          searchValue: "",
          setSearchValue: (value) => set({ searchValue: value }),
          filter: null,
          setFilter: (filter) => set({ filter }),
          queryBoxAction: {
            insertTextAtCaret: (text) => {
              get().queryBoxAction.deleteTriggerWord();
              document.execCommand("insertText", false, text);
            },
            deleteTriggerWord: () => {
              const $textarea = UiUtils.getActiveQueryBoxTextarea();

              if (!$textarea.length) return;

              const { start, end } = UiUtils.getWordOnCaret($textarea[0]);

              $textarea[0].setSelectionRange(start, end);
              document.execCommand("delete", false, undefined);
            },
            clearSearchValue() {
              const $textarea = UiUtils.getActiveQueryBoxTextarea();

              if (!$textarea.length) return;

              const { word, start, end } = UiUtils.getWordOnCaret($textarea[0]);

              if (word === "/") return;

              $textarea[0].setSelectionRange(start + 1, end);
              document.execCommand("delete", false, undefined);

              set({ searchValue: "" });
            },
          },
        }),
      ),
    ),
  );

export const slashCommandMenuStore = useSlashCommandMenuStore;
