import { Portal } from "@/components/ui/portal";
import { globalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import BetterCopyButton from "@/features/plugins/thread/better-message-copy-buttons/CopyButton";
import hideNativeButtonsCss from "@/features/plugins/thread/better-message-copy-buttons/hide-native-buttons.css?inline";
import { useObserver } from "@/features/plugins/thread/better-message-copy-buttons/useObserver";
import { useInsertCss } from "@/hooks/useInsertCss";

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
