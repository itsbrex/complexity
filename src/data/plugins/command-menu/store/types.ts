import { SearchFilter } from "@/data/plugins/command-menu/items";

export type UIState = {
  open: boolean;
  inputRef: React.RefObject<HTMLInputElement> | null;
};

export type SearchState = {
  searchValue: string;
  selectedValue: string;
};

export type FilterState = {
  filter: SearchFilter | null;
  spacethreadFilterSlug: string | null;
  spacethreadTitle: string | null;
};

export type CommandMenuState = UIState & SearchState & FilterState;

export type CommandMenuActions = {
  setOpen: (open: boolean) => void;
  setInputRef: (ref: React.RefObject<HTMLInputElement> | null) => void;
  setSearchValue: (value: string) => void;
  setSelectedValue: (value: string) => void;
  setFilter: (filter: SearchFilter | null) => void;
  setSpacethreadFilterSlug: (slug: string | null) => void;
  setSpacethreadTitle: (title: string | null) => void;
  closeCommandMenu: () => void;
  reset: () => void;
};
