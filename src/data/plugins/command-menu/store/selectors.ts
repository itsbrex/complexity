import { useCommandMenuStore } from "@/data/plugins/command-menu/store/index";

export const useCommandMenuActions = () =>
  useCommandMenuStore((state) => ({
    setOpen: state.setOpen,
    setSearchValue: state.setSearchValue,
    setFilter: state.setFilter,
    closeCommandMenu: state.closeCommandMenu,
    reset: state.reset,
  }));
