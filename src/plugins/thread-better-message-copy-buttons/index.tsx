import { globalDomObserverStore } from "@/plugins/_api/dom-observer/global-dom-observer-store";
import CopyButton from "@/plugins/thread-better-message-copy-buttons/CopyButton";

export default function BetterMessageCopyButton({
  messageBlockIndex,
}: {
  messageBlockIndex: number;
}) {
  return (
    <CopyButton
      messageBlockIndex={messageBlockIndex}
      hasSources={
        (globalDomObserverStore.getState().threadComponents.messageBlocks?.[
          messageBlockIndex
        ]?.$sourcesHeading.length ?? 0) > 0
      }
    />
  );
}
