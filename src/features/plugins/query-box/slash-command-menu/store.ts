import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { FilterMode } from "@/features/plugins/query-box/slash-command-menu/FilterItems";
import UiUtils from "@/utils/UiUtils";

type SlashCommandMenuStore = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  searchValueBoundary: {
    ignoreLeftCount: number | null;
    ignoreRightCount: number | null;
  };
  setSearchValueBoundary: (boundary: {
    ignoreLeftCount: number | null;
    ignoreRightCount: number | null;
  }) => void;
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
                selectedValue: "",
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
          searchValueBoundary: {
            ignoreLeftCount: null,
            ignoreRightCount: null,
          },
          setSearchValueBoundary: (boundary) =>
            set({ searchValueBoundary: boundary }),
          filter: null,
          setFilter: (filter) => set({ filter }),
          queryBoxAction: {
            insertTextAtCaret: (text) => {
              get().queryBoxAction.deleteTriggerWord();

              queueMicrotask(() => {
                UiUtils.getActiveQueryBoxTextarea().trigger("focus");
                document.execCommand("insertText", false, text);
              });
            },
            deleteTriggerWord: () => {
              const $textarea = UiUtils.getActiveQueryBoxTextarea();

              if (!$textarea.length) return;

              const { ignoreLeftCount, ignoreRightCount } =
                get().searchValueBoundary;

              if (ignoreLeftCount == null || ignoreRightCount == null) return;

              $textarea[0].setSelectionRange(
                ignoreLeftCount - 1,
                $textarea[0].value.length - ignoreRightCount,
              );

              queueMicrotask(() => {
                $textarea.trigger("focus");
                document.execCommand("delete", false, undefined);
              });
            },
            clearSearchValue() {
              const $textarea = UiUtils.getActiveQueryBoxTextarea();

              if (!$textarea.length) return;

              const { ignoreLeftCount, ignoreRightCount } =
                get().searchValueBoundary;

              if (ignoreLeftCount == null || ignoreRightCount == null) return;

              const word = $textarea[0].value.slice(
                ignoreLeftCount - 1,
                $textarea[0].value.length - ignoreRightCount,
              );

              if (word === "/") return;

              $textarea[0].setSelectionRange(
                ignoreLeftCount,
                $textarea[0].value.length - ignoreRightCount,
              );

              queueMicrotask(() => {
                $textarea.trigger("focus");
                document.execCommand("delete", false, undefined);
              });

              set({ searchValue: "" });
            },
          },
        }),
      ),
    ),
  );

export const slashCommandMenuStore = useSlashCommandMenuStore;
