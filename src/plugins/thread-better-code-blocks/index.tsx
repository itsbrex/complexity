import { Portal } from "@/components/ui/portal";
import { useInsertCss } from "@/hooks/useInsertCss";
import { useGlobalDomObserverStore } from "@/plugins/_api/dom-observer/global-dom-observer-store";
import hideNativeCodeBlocksCss from "@/plugins/thread-better-code-blocks/hide-native-code-blocks.css?inline";
import MirroredCodeBlock from "@/plugins/thread-better-code-blocks/MirroredCodeBlock";
import { MirroredCodeBlockContextProvider } from "@/plugins/thread-better-code-blocks/MirroredCodeBlockContext";
import { useMirroredCodeBlocksStore } from "@/plugins/thread-better-code-blocks/store";
import useBetterCodeBlockOptions from "@/plugins/thread-better-code-blocks/useBetterCodeBlockOptions";
import useProcessCodeBlocks from "@/plugins/thread-better-code-blocks/useProcessCodeBlocks";

type MemoizedWrapperProps = {
  language: string | null;
  codeString: string | null;
  isInFlight: boolean;
  isMessageBlockInFlight: boolean;
  sourceMessageBlockIndex: number;
  sourceCodeBlockIndex: number;
  codeElement: Element;
};

const MemoizedWrapper = memo(function MemoizedWrapper({
  language,
  codeString,
  isInFlight,
  isMessageBlockInFlight,
  sourceMessageBlockIndex,
  sourceCodeBlockIndex,
  codeElement,
}: MemoizedWrapperProps) {
  const settings = useBetterCodeBlockOptions({ language });

  if (!language || !codeString) return null;

  return (
    <MirroredCodeBlockContextProvider
      storeValue={{
        language,
        codeString,
        sourceMessageBlockIndex,
        sourceCodeBlockIndex,
        isInFlight,
        isMessageBlockInFlight,
        codeElement,
        isWrapped: !settings.unwrap.enabled,
        maxHeight:
          settings.maxHeight.enabled && settings.maxHeight.collapseByDefault
            ? settings.maxHeight.value
            : 9999,
      }}
    >
      <MirroredCodeBlock />
    </MirroredCodeBlockContextProvider>
  );
});

export default function BetterCodeBlocksWrapper() {
  const messageBlocks = useGlobalDomObserverStore(
    (state) => state.threadComponents.messageBlocks,
  );

  useProcessCodeBlocks();

  const mirroredCodeBlocks = useMirroredCodeBlocksStore(
    (state) => state.blocks,
  );

  useInsertCss({
    id: "cplx-hide-native-code-blocks",
    css: hideNativeCodeBlocksCss,
  });

  return mirroredCodeBlocks.map((messageBlock, sourceMessageBlockIndex) =>
    messageBlock.map((mirroredCodeBlock, sourceCodeBlockIndex) => {
      const { language, codeString, isInFlight, portalContainer } =
        mirroredCodeBlock;

      return (
        <Portal
          key={`${sourceMessageBlockIndex}-${sourceCodeBlockIndex}`}
          container={portalContainer}
        >
          <MemoizedWrapper
            language={language}
            codeString={codeString}
            isInFlight={isInFlight}
            isMessageBlockInFlight={
              !!messageBlocks?.[sourceMessageBlockIndex]?.isInFlight
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
