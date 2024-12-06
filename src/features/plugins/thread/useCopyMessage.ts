import { useQuery } from "@tanstack/react-query";

import { toast } from "@/components/ui/use-toast";
import { ThreadMessageApiResponse } from "@/services/pplx-api/pplx-api.types";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import {
  DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS,
  DOM_SELECTORS,
} from "@/utils/dom-selectors";
import { errorWrapper } from "@/utils/error-wrapper";
import { ThreadExport } from "@/utils/thread-export";
import { parseUrl } from "@/utils/utils";

type FetchFn = () => Promise<ThreadMessageApiResponse[] | undefined>;

type CopyMessageParams = {
  messageBlockIndex: number;
  withCitations: boolean;
  onComplete?: () => void;
};

export function useCopyMessage() {
  const threadSlug = parseUrl().pathname.split("/").pop() || "";

  const { isFetching, refetch } = useQuery({
    ...pplxApiQueries.threadInfo(threadSlug),
    enabled: false,
  });

  const fetchFn = useCallback(async () => (await refetch()).data, [refetch]);

  return {
    isFetching,
    copyMessage: async function copyMessage({
      messageBlockIndex,
      withCitations,
      onComplete,
    }: CopyMessageParams) {
      try {
        if (withCitations) {
          await copyMessageWithCitations({ messageBlockIndex });
        } else {
          await copyMessageWithoutCitations({ messageBlockIndex, fetchFn });
        }
        onComplete?.();
      } catch (error) {
        toast({
          title: "❌ Failed to copy message",
          description:
            error instanceof Error ? error.message : "Unknown error occurred",
        });
      }
    },
    copyThread: async function copyThread({
      withCitations,
      onComplete,
    }: {
      withCitations: CopyMessageParams["withCitations"];
      onComplete?: CopyMessageParams["onComplete"];
    }) {
      if (withCitations) {
        await copyThreadWithCitations({ fetchFn });
      } else {
        await copyThreadWithoutCitations({ fetchFn });
      }
      onComplete?.();
    },
  };
}

async function copyMessageWithCitations({
  messageBlockIndex,
}: {
  messageBlockIndex: number;
}) {
  $(
    `[data-cplx-component="${DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.MESSAGE.BLOCK}"][data-index="${messageBlockIndex}"] [data-cplx-component="${DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.BOTTOM_BAR}"] ${DOM_SELECTORS.THREAD.MESSAGE.BOTTOM_BAR_CHILD.COPY_BUTTON}`,
  ).trigger("click");
}

async function copyMessageWithoutCitations({
  messageBlockIndex,
  fetchFn,
}: {
  messageBlockIndex: number;
  fetchFn: FetchFn;
}) {
  return copyContent({ messageBlockIndex, fetchFn, withCitations: false });
}

async function copyThreadWithCitations({ fetchFn }: { fetchFn: FetchFn }) {
  return copyContent({ fetchFn, withCitations: true });
}

async function copyThreadWithoutCitations({ fetchFn }: { fetchFn: FetchFn }) {
  return copyContent({ fetchFn, withCitations: false });
}

async function copyContent({
  withCitations,
  messageBlockIndex,
  fetchFn,
}: {
  withCitations: boolean;
  messageBlockIndex?: number;
  fetchFn: FetchFn;
}) {
  if (fetchFn == null) {
    throw new Error("Fetch function not provided");
  }

  const threadJson = await fetchFn();
  if (threadJson == null) {
    throw new Error("Failed to fetch thread info");
  }

  const messageWithoutCitations = ThreadExport.exportThread({
    threadJSON: threadJson,
    includeCitations: withCitations,
    messageIndex: messageBlockIndex,
  });

  const [, error] = await errorWrapper(() =>
    navigator.clipboard.writeText(messageWithoutCitations),
  )();

  if (error) {
    console.error(error);
    throw new Error("Please click/focus on the page while copying!");
  }
}
