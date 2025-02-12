import { useThreadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import CopyButton from "@/plugins/thread-better-message-copy-buttons/CopyButton";

export default function BetterMessageCopyButton({
  messageBlockIndex,
}: {
  messageBlockIndex: number;
}) {
  const $sources = useThreadMessageBlocksDomObserverStore(
    (store) => store.messageBlocks?.[messageBlockIndex]?.nodes?.$sources,
    deepEqual,
  );

  if (!$sources) return null;

  const hasSources = $sources.length > 0;

  return (
    <CopyButton messageBlockIndex={messageBlockIndex} hasSources={hasSources} />
  );
}
