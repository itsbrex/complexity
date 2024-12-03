import { Portal } from "@/components/ui/portal";
import { useGlobalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import hideNativeCodeBlocksCss from "@/features/plugins/thread/better-code-blocks/hide-native-code-blocks.css?inline";
import MirroredCodeBlock from "@/features/plugins/thread/better-code-blocks/MirroredCodeBlock";
import { MirroredCodeBlockContextProvider } from "@/features/plugins/thread/better-code-blocks/MirroredCodeBlockContext";
import useBetterCodeBlockOptions from "@/features/plugins/thread/better-code-blocks/useBetterCodeBlockOptions";
import { useMirroredCodeBlocks } from "@/features/plugins/thread/better-code-blocks/useMirroredCodeBlocks";
import { useInsertCss } from "@/hooks/useInsertCss";

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
        maxHeight: settings.maxHeight.enabled ? settings.maxHeight.value : 9999,
        content: "code",
      }}
    >
      <MirroredCodeBlock variant="base" />
    </MirroredCodeBlockContextProvider>
  );
});

export default function BetterCodeBlocksWrapper() {
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
