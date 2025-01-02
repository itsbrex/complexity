import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  SandpackPreviewRef,
  useSandpack,
} from "@codesandbox/sandpack-react";

import { Button } from "@/components/ui/button";
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
import UiUtils from "@/utils/UiUtils";

export default function ReactRenderer() {
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
      canvasStore.setState({
        sandpackPreviewRef: previewRef.current,
      });
    }
  }, []);

  return (
    <div id="sandpack-container" className="tw-relative tw-size-full">
      <SandpackProvider
        template="react"
        customSetup={{
          dependencies: {
            recharts: "2.15.0",
          },
        }}
        files={{
          "/App.js": code,
        }}
        options={{
          externalResources: [
            "https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css",
          ],
        }}
      >
        <SandpackLayout>
          <SandpackPreview
            ref={previewRef}
            showRefreshButton={false}
            showOpenInCodeSandbox={false}
          />
        </SandpackLayout>
        <FixErrorButton />
      </SandpackProvider>
    </div>
  );
});

function FixErrorButton() {
  const { sandpack } = useSandpack();

  if (!sandpack.error) return null;

  return (
    <Button
      variant="destructive"
      className="tw-absolute tw-bottom-4 tw-right-8 tw-z-10 tw-animate-in tw-fade-in-0"
      onClick={() => {
        if (!sandpack.error) return;

        const $textarea = UiUtils.getActiveQueryBoxTextarea();

        if (!$textarea.length) return;

        $textarea.trigger("focus");

        document.execCommand("insertText", false, sandpack.error.message);
      }}
    >
      Fix Error
    </Button>
  );
}
