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
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";

export default function BetterCodeBlocksWrapper() {
  const codeBlocksChunks = useThreadCodeBlocksDomObserverStore(
    (store) => store.codeBlocksChunks,
    deepEqual,
  );

  const messageBlocksCount = codeBlocksChunks?.length ?? 0;
  const codeBlocksCount =
    codeBlocksChunks?.reduce((acc, chunk) => acc + chunk.length, 0) ?? 0;

  const shouldEnable = messageBlocksCount <= 15 && codeBlocksCount <= 50;

  useInsertCss({
    id: "cplx-hide-native-code-blocks",
    css: hideNativeCodeBlocksCss,
    inject: shouldEnable,
  });

  if (!codeBlocksChunks || !shouldEnable) return null;

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

  const settings =
    getBetterCodeBlockOptions(codeBlock.content.language) ??
    ExtensionLocalStorageService.getCachedSync().plugins[
      "thread:betterCodeBlocks"
    ];

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
          isWrapped: !settings.unwrap.enabled,
          maxHeight:
            settings.maxHeight.enabled && settings.maxHeight.collapseByDefault
              ? settings.maxHeight.value
              : 9999,
          isHorizontalOverflowing: false,
          isVerticalOverflowing: false,
        }}
      >
        {children}
      </MirroredCodeBlockContextProvider>
    </Portal>
  );
}
