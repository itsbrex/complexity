import { useCommandMenuStore } from "@/data/plugins/command-menu/store";

export function useSearchFilter() {
  const { searchValue, setSearchValue, setFilter } = useCommandMenuStore();

  useEffect(() => {
    const handleSearchFilter = () => {
      if (searchValue.startsWith("thread")) {
        setFilter("threads");
        setSearchValue(searchValue.slice("thread".length));
        return;
      }

      if (searchValue.startsWith("space")) {
        setFilter("spaces");
        setSearchValue(searchValue.slice("space".length));
        return;
      }
    };

    handleSearchFilter();
  }, [searchValue, setFilter, setSearchValue]);
}
