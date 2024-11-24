import { Portal } from "@/components/ui/portal";
import { useGlobalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import hideNativeCodeBlocksCss from "@/features/plugins/thread/better-code-blocks/hide-native-code-blocks.css?inline";
import MirroredCodeBlock from "@/features/plugins/thread/better-code-blocks/MirroredCodeBlock";
import { MirroredCodeBlockContextProvider } from "@/features/plugins/thread/better-code-blocks/MirroredCodeBlockContext";
import { useMirroredCodeBlocks } from "@/features/plugins/thread/better-code-blocks/useMirroredCodeBlocks";
import { useInsertCss } from "@/hooks/useInsertCss";

type MemoizedWrapperProps = {
  lang: string;
  codeString: string;
  isInFlight: boolean;
  isMessageBlockInFlight: boolean;
  sourceMessageBlockIndex: number;
  sourceCodeBlockIndex: number;
  codeElement: Element;
};

const MemoizedWrapper = memo(function MemoizedWrapper({
  lang,
  codeString,
  isInFlight,
  isMessageBlockInFlight,
  sourceMessageBlockIndex,
  sourceCodeBlockIndex,
  codeElement,
}: MemoizedWrapperProps) {
  return (
    <MirroredCodeBlockContextProvider
      key={`${sourceMessageBlockIndex}-${sourceCodeBlockIndex}`}
      storeValue={{
        lang,
        codeString,
        sourceMessageBlockIndex,
        sourceCodeBlockIndex,
        isInFlight,
        isMessageBlockInFlight,
        codeElement,
      }}
    >
      <MirroredCodeBlock variant="standard" />
    </MirroredCodeBlockContextProvider>
  );
});

export function BetterCodeBlocksWrapper() {
  const messageBlocks = useGlobalDomObserverStore(
    (state) => state.threadComponents.messageBlocks,
  );
  const mirroredCodeBlocksPortalContainers = useMirroredCodeBlocks();

  useInsertCss({
    id: "cplx-hide-native-code-blocks",
    css: hideNativeCodeBlocksCss,
  });

  return mirroredCodeBlocksPortalContainers.map(
    (messageBlock, sourceMessageBlockIndex) =>
      messageBlock.map((mirroredCodeBlock, sourceCodeBlockIndex) => {
        const { lang, codeString, isInFlight, portalContainer } =
          mirroredCodeBlock;

        if (!codeString || !lang) return null;

        return (
          <Portal
            key={`${sourceMessageBlockIndex}-${sourceCodeBlockIndex}`}
            container={portalContainer}
          >
            <MemoizedWrapper
              lang={lang}
              codeString={codeString}
              isInFlight={isInFlight ?? false}
              isMessageBlockInFlight={
                messageBlocks?.[sourceMessageBlockIndex]?.isInFlight ?? false
              }
              sourceMessageBlockIndex={sourceMessageBlockIndex}
              sourceCodeBlockIndex={sourceCodeBlockIndex}
              codeElement={mirroredCodeBlock.$code[0]}
            />
          </Portal>
        );
      }),
  );
}
