import { useQuery } from "@tanstack/react-query";

import { getLocalThemesService } from "@/services/indexed-db/themes/themes";

export function useLocalThemes() {
  return useQuery({
    queryKey: ["local-themes"],
    queryFn: () => getLocalThemesService().getAll(),
  });
}
