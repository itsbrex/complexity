import { Portal } from "@/components/ui/portal";
import { useGlobalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import hideNativeCodeBlocksCss from "@/features/plugins/thread/better-code-blocks/hide-native-code-blocks.css?inline";
import { MirroredCodeBlock } from "@/features/plugins/thread/better-code-blocks/MirroredCodeBlock";
import { useMirroredCodeBlocks } from "@/features/plugins/thread/better-code-blocks/useMirroredCodeBlocks";
import { useInsertCss } from "@/hooks/useInsertCss";

export function BetterCodeBlocksWrapper() {
  useInsertCss({
    id: "cplx-hide-native-code-blocks",
    css: hideNativeCodeBlocksCss,
  });

  const messageBlocks = useGlobalDomObserverStore(
    (state) => state.threadComponents.messageBlocks,
  );

  const mirroredCodeBlocksPortalContainers = useMirroredCodeBlocks();

  return mirroredCodeBlocksPortalContainers.map(
    (messageBlock, messageBlockIndex) =>
      messageBlock.map((mirroredCodeBlock, codeBlockIndex) => {
        const { lang, codeString, isInFlight, portalContainer } =
          mirroredCodeBlock;

        if (!codeString || !lang) return null;

        return (
          <Portal
            key={`${messageBlockIndex}-${codeBlockIndex}`}
            container={portalContainer}
          >
            <MirroredCodeBlock
              lang={lang}
              codeString={codeString}
              messageBlockIndex={messageBlockIndex}
              codeBlockIndex={codeBlockIndex}
              isInFlight={!!isInFlight}
              isMessageBlockInFlight={
                messageBlocks?.[messageBlockIndex]?.isInFlight ?? false
              }
            />
          </Portal>
        );
      }),
  );
}
