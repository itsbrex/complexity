import { createQueryKeys } from "@lukemorales/query-key-factory";

import { PluginsStatesService } from "@/services/plugins-states/plugins-states";

export const pluginsStatesQueries = createQueryKeys("pluginsStates", {
  computed: {
    queryKey: null,
    queryFn: () => PluginsStatesService.get({ cache: false }),
  },
});
