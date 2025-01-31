import { useGlobalDomObserverStore } from "@/plugins/_api/dom-observer/global-dom-observer-store";
import CopyButton from "@/plugins/thread-better-message-copy-buttons/CopyButton";

export default function BetterMessageCopyButton({
  messageBlockIndex,
}: {
  messageBlockIndex: number;
}) {
  const $sourcesHeading = useGlobalDomObserverStore(
    (store) =>
      store.threadComponents.messageBlocks?.[messageBlockIndex]
        ?.$sourcesHeading,
  );

  if (!$sourcesHeading) return null;

  const hasSources = $sourcesHeading.length > 0;

  return (
    <CopyButton messageBlockIndex={messageBlockIndex} hasSources={hasSources} />
  );
}
