import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  SandpackPreviewRef,
} from "@codesandbox/sandpack-react";

import {
  getMirroredCodeBlockByLocation,
  useMirroredCodeBlocksStore,
} from "@/features/plugins/thread/better-code-blocks/store";
import styles from "@/features/plugins/thread/canvas/components/renderer/sandpack.css?inline";
import {
  canvasStore,
  useCanvasStore,
} from "@/features/plugins/thread/canvas/store";
import { useInsertCss } from "@/hooks/useInsertCss";

export default function HtmlRenderer() {
  const selectedCodeBlockLocation = useCanvasStore(
    (state) => state.selectedCodeBlockLocation,
  );
  const mirroredCodeBlocks = useMirroredCodeBlocksStore(
    (state) => state.blocks,
  );
  const selectedCodeBlock = getMirroredCodeBlockByLocation({
    mirroredCodeBlocks,
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });

  const code = selectedCodeBlock?.codeString;

  if (!code) {
    return null;
  }

  return <MemoizedPreviewContainer code={code} />;
}

const MemoizedPreviewContainer = memo(function MemoizedPreviewContainer({
  code,
}: {
  code: string;
}) {
  useInsertCss({
    id: "sandpack",
    css: styles,
  });

  const previewRef = useRef<SandpackPreviewRef>(null);

  useEffect(() => {
    if (previewRef.current) {
      canvasStore.getState().setSandpackPreviewRef(previewRef.current);
    }
  }, []);

  return (
    <div id="sandpack-container" className="tw-relative tw-size-full">
      <SandpackProvider
        template="static"
        files={{ "/index.html": code, "/assets/style.css": "something here" }}
      >
        <SandpackLayout>
          <SandpackPreview
            ref={previewRef}
            showRefreshButton={false}
            showOpenInCodeSandbox={false}
          />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
});
