import { toast } from "@/components/ui/use-toast";
import { globalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { ThreadMessageApiResponse } from "@/services/pplx-api/pplx-api.types";
import { DOM_SELECTORS } from "@/utils/dom-selectors";
import { errorWrapper } from "@/utils/error-wrapper";
import { ThreadExport } from "@/utils/thread-export";

type CopyMessageParams = {
  messageBlockIndex: number;
  withCitations: boolean;
  onComplete: () => void;
  fetchFn?: () => Promise<ThreadMessageApiResponse[] | undefined>;
};

export function useCopyMessage() {
  return async function copyMessage({
    messageBlockIndex,
    withCitations,
    onComplete,
    fetchFn,
  }: CopyMessageParams) {
    try {
      if (withCitations) {
        await copyWithCitations(messageBlockIndex);
      } else {
        await copyWithoutCitations(messageBlockIndex, fetchFn);
      }
      onComplete();
    } catch (error) {
      toast({
        title: "❌ Failed to copy message",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };
}

async function copyWithCitations(messageBlockIndex: number) {
  const messageBlockBottomBar = globalDomObserverStore.getState().threadComponents
    .messageBlockBottomBars?.[messageBlockIndex];

  if (!messageBlockBottomBar) {
    throw new Error("Message block bottom bar not found");
  }

  const $copyButton = $(messageBlockBottomBar).find(
    DOM_SELECTORS.THREAD.MESSAGE.BOTTOM_BAR_CHILD.COPY_BUTTON,
  );

  if ($copyButton.length === 0) {
    throw new Error("Copy button not found");
  }

  $copyButton.trigger("click");
}

async function copyWithoutCitations(
  messageBlockIndex: number,
  fetchFn?: () => Promise<ThreadMessageApiResponse[] | undefined>,
) {
  if (!fetchFn) {
    throw new Error("Fetch function not provided");
  }

  const threadJson = await fetchFn();
  if (!threadJson) {
    throw new Error("Failed to fetch thread info");
  }

  const messageWithoutCitations = ThreadExport.exportThread({
    threadJSON: threadJson,
    includeCitations: false,
    messageIndex: messageBlockIndex,
  });

  const [, error] = await errorWrapper(() =>
    navigator.clipboard.writeText(messageWithoutCitations),
  )();

  if (error) {
    console.error(error);
    throw new Error("Please click/focus on the page while copying the message!");
  }
} 