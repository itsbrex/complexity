import { ReactNode } from "react";

import { Portal } from "@/components/ui/portal";
import { useInsertCss } from "@/hooks/useInsertCss";
import useThreadCodeBlock from "@/plugins/_core/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import { useThreadCodeBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/code-blocks/store";
import hideNativeCodeBlocksCss from "@/plugins/thread-better-code-blocks/hide-native-code-blocks.css?inline";
import MirroredCodeBlock from "@/plugins/thread-better-code-blocks/MirroredCodeBlock";
import { MirroredCodeBlockContextProvider } from "@/plugins/thread-better-code-blocks/MirroredCodeBlockContext";
import {
  createMirroredPortalContainer,
  getBetterCodeBlockOptions,
} from "@/plugins/thread-better-code-blocks/utils";

export default function BetterCodeBlocksWrapper() {
  const codeBlocksChunks = useThreadCodeBlocksDomObserverStore(
    (store) => store.codeBlocksChunks,
    deepEqual,
  );

  useInsertCss({
    id: "cplx-hide-native-code-blocks",
    css: hideNativeCodeBlocksCss,
  });

  if (!codeBlocksChunks) return null;

  return codeBlocksChunks.map((chunk, sourceMessageBlockIndex) =>
    chunk.map((_, sourceCodeBlockIndex) => (
      <ContextWrapper
        key={`${sourceMessageBlockIndex}-${sourceCodeBlockIndex}`}
        sourceMessageBlockIndex={sourceMessageBlockIndex}
        sourceCodeBlockIndex={sourceCodeBlockIndex}
      >
        <MirroredCodeBlock />
      </ContextWrapper>
    )),
  );
}

function ContextWrapper({
  children,
  sourceMessageBlockIndex,
  sourceCodeBlockIndex,
}: {
  children: ReactNode;
  sourceMessageBlockIndex: number;
  sourceCodeBlockIndex: number;
}) {
  const codeBlock = useThreadCodeBlock({
    messageBlockIndex: sourceMessageBlockIndex,
    codeBlockIndex: sourceCodeBlockIndex,
  });

  if (!codeBlock) return null;

  const finegrainedSettings = getBetterCodeBlockOptions(
    codeBlock.content.language,
  );

  const portalContainer = createMirroredPortalContainer(
    codeBlock,
    sourceCodeBlockIndex,
  );

  return (
    <Portal container={portalContainer}>
      <MirroredCodeBlockContextProvider
        storeValue={{
          sourceMessageBlockIndex,
          sourceCodeBlockIndex,
          isWrapped: !finegrainedSettings.unwrap.enabled,
          maxHeight:
            finegrainedSettings.maxHeight.enabled &&
            finegrainedSettings.maxHeight.collapseByDefault
              ? finegrainedSettings.maxHeight.value
              : 9999,
        }}
      >
        {children}
      </MirroredCodeBlockContextProvider>
    </Portal>
  );
}
