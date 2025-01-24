import { Portal } from "@/components/ui/portal";
import { useInsertCss } from "@/hooks/useInsertCss";
import { globalDomObserverStore } from "@/plugins/_api/dom-observer/global-dom-observer-store";
import BetterCopyButton from "@/plugins/thread-better-message-copy-buttons/CopyButton";
import hideNativeButtonsCss from "@/plugins/thread-better-message-copy-buttons/hide-native-buttons.css?inline";
import { useObserver } from "@/plugins/thread-better-message-copy-buttons/useObserver";

export default function BetterMessageCopyButtons() {
  const portalContainers = useObserver();

  useInsertCss({
    id: "cplx-better-message-copy-buttons-hide-native-buttons",
    css: hideNativeButtonsCss,
  });

  return portalContainers.map((portalContainer, index) => (
    <Portal key={index} container={portalContainer as HTMLElement}>
      <BetterCopyButton
        messageBlockIndex={index}
        hasSources={
          (globalDomObserverStore.getState().threadComponents.messageBlocks?.[
            index
          ]?.$sourcesHeading.length ?? 0) > 0
        }
      />
    </Portal>
  ));
}
