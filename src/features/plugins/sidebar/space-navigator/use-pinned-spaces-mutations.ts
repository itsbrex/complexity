import { useMutation } from "@tanstack/react-query";

import { PinnedSpace } from "@/data/plugins/space-navigator/pinned-space.types";
import { getPinnedSpacesService } from "@/services/indexed-db/pinned-spaces/pinned-spaces";
import { pinnedSpacesQueries } from "@/services/indexed-db/pinned-spaces/query-keys";
import { Space } from "@/services/pplx-api/pplx-api.types";
import { queryClient } from "@/utils/ts-query-client";

export function usePinSpaceMutation() {
  return useMutation({
    mutationKey: ["pinSpaceOnSidebar"],
    mutationFn: async ({ space }: { space: Space }) => {
      return await getPinnedSpacesService().add({
        uuid: space.uuid,
        title: space.title,
        emoji: space.emoji,
        slug: space.slug,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: pinnedSpacesQueries.list.queryKey,
        exact: true,
      });
    },
  });
}

export function useUnpinSpaceMutation() {
  return useMutation({
    mutationKey: ["unpinSpace"],
    mutationFn: async ({ uuid }: { uuid: PinnedSpace["uuid"] }) => {
      return await getPinnedSpacesService().delete(uuid);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: pinnedSpacesQueries.list.queryKey,
        exact: true,
      });
    },
  });
}
