import { BetterCodeBlockFineGrainedOptions } from "@/data/better-code-blocks/better-code-blocks-options";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { betterCodeBlocksFineGrainedOptionsQueries } from "@/services/indexed-db/better-code-blocks/query-keys";
import { queryClient } from "@/utils/ts-query-client";

type UseBetterCodeBlockOptionsProps = {
  language: string;
};

export default function useBetterCodeBlockOptions({
  language,
}: UseBetterCodeBlockOptionsProps) {
  const globalSettings =
    ExtensionLocalStorageService.getCachedSync().plugins[
      "thread:betterCodeBlocks"
    ];

  const fineGrainedSettings = queryClient
    .getQueryData<
      BetterCodeBlockFineGrainedOptions[]
    >(betterCodeBlocksFineGrainedOptionsQueries.list.queryKey)
    ?.find((option) => option.language === language);

  return fineGrainedSettings || globalSettings;
}
