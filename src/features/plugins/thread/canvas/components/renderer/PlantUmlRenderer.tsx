import { useQuery } from "@tanstack/react-query";
import { LuLoaderCircle } from "react-icons/lu";

import {
  getMirroredCodeBlockByLocation,
  useMirroredCodeBlocksStore,
} from "@/features/plugins/thread/better-code-blocks/store";
import { useCanvasStore } from "@/features/plugins/thread/canvas/store";
import { generatePlantUMLUrl } from "@/utils/plantUml";

export default function MermaidRenderer() {
  const selectedCodeBlockLocation = useCanvasStore(
    (state) => state.selectedCodeBlockLocation,
  );
  const mirroredCodeBlocks = useMirroredCodeBlocksStore(
    (state) => state.blocks,
  );
  const selectedCodeBlock = getMirroredCodeBlockByLocation({
    mirroredCodeBlocks,
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });

  const code = selectedCodeBlock?.codeString;

  const {
    data: svg,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["canvas", "plantuml"],
    queryFn: async () => {
      if (!code) {
        return null;
      }

      const resp = await fetch(generatePlantUMLUrl(code));

      if (!resp.ok) {
        throw new Error("Failed to render PlantUML code");
      }

      return resp.text();
    },
    enabled: !!code,
    retry: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetch();
  }, [code, refetch]);

  return (
    <div className="tw-relative tw-size-full">
      {isFetching && (
        <div className="tw-absolute tw-inset-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2 tw-animate-in tw-fade-in">
          <LuLoaderCircle className="tw-size-10 tw-animate-spin tw-text-muted-foreground" />
        </div>
      )}
      {!isFetching && !isError && svg && (
        <div
          className="tw-flex tw-size-full tw-items-center tw-justify-center tw-animate-in tw-fade-in"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
    </div>
  );
}
