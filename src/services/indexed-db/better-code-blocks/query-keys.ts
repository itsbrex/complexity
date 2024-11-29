import { createQueryKeys } from "@lukemorales/query-key-factory";

import { getBetterCodeBlocksOptionsService } from "@/services/indexed-db/better-code-blocks/better-code-blocks";

export const betterCodeBlocksFineGrainedOptionsQueries = createQueryKeys(
  "betterCodeBlocksFineGrainedOptions",
  {
    list: {
      queryKey: null,
      queryFn: () => getBetterCodeBlocksOptionsService().getAll(),
    },
    get: (language: string) => ({
      queryKey: [{ language }],
      queryFn: () => getBetterCodeBlocksOptionsService().get(language),
    }),
  },
);
