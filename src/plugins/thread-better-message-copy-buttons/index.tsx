import { useThreadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import CopyButton from "@/plugins/thread-better-message-copy-buttons/CopyButton";

export default function BetterMessageCopyButton({
  messageBlockIndex,
}: {
  messageBlockIndex: number;
}) {
  const $sourcesHeading = useThreadMessageBlocksDomObserverStore(
    (store) => store.messageBlocks?.[messageBlockIndex]?.nodes?.$sourcesHeading,
    deepEqual,
  );

  if (!$sourcesHeading) return null;

  const hasSources = $sourcesHeading.length > 0;

  return (
    <CopyButton messageBlockIndex={messageBlockIndex} hasSources={hasSources} />
  );
}
