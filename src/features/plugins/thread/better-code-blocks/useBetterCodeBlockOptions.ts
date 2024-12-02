import { BetterCodeBlockFineGrainedOptions } from "@/data/dashboard/better-code-blocks/better-code-blocks-options.types";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { betterCodeBlocksFineGrainedOptionsQueries } from "@/services/indexed-db/better-code-blocks/query-keys";
import { queryClient } from "@/utils/ts-query-client";

type UseBetterCodeBlockOptionsProps = {
  language: string | null;
};

export default function useBetterCodeBlockOptions({
  language,
}: UseBetterCodeBlockOptionsProps) {
  const globalSettings =
    ExtensionLocalStorageService.getCachedSync().plugins[
      "thread:betterCodeBlocks"
    ];

  const fineGrainedSettings = language
    ? queryClient
        .getQueryData<
          BetterCodeBlockFineGrainedOptions[]
        >(betterCodeBlocksFineGrainedOptionsQueries.list.queryKey)
        ?.find((option) => option.language === language)
    : null;

  return fineGrainedSettings || globalSettings;
}
