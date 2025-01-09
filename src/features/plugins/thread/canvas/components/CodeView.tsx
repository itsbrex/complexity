import { CSSProperties, ReactNode } from "react";

import CodeHighlighter from "@/components/CodeHighlighter";
import {
  useMirroredCodeBlocksStore,
  getMirroredCodeBlockByLocation,
} from "@/features/plugins/thread/better-code-blocks/store";
import { getInterpretedCanvasLanguage } from "@/features/plugins/thread/canvas/canvas.types";
import { useCanvasStore } from "@/features/plugins/thread/canvas/store";

export default function CodeView() {
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
  const isInFlight = selectedCodeBlock?.isInFlight;
  const codeString = selectedCodeBlock?.codeString ?? "";
  const language = getInterpretedCanvasLanguage(
    selectedCodeBlock?.language ?? "",
  );

  const lineNumberStyle = useMemo((): CSSProperties => {
    return {
      color: "oklch(var(--muted-foreground))",
    };
  }, []);

  const preTag = useMemo(() => {
    const PreComponent = ({ children }: { children: ReactNode }) => (
      <pre className="tw-px-4 tw-py-2">{children}</pre>
    );
    PreComponent.displayName = "PreTag";
    return PreComponent;
  }, []);

  return (
    <div
      id="canvas-code-view"
      className={cn(
        "tw-h-full tw-w-max tw-min-w-full tw-text-xs [&>pre]:tw-m-0 [&>pre]:tw-size-full [&>pre]:tw-rounded-t-none [&_span.linenumber]:!tw-text-muted-foreground",
        {
          "[&_span]:tw-duration-300 [&_span]:tw-animate-in [&_span]:tw-fade-in":
            isInFlight,
        },
      )}
    >
      <CodeHighlighter
        showLineNumbers
        language={language}
        lineNumberStyle={lineNumberStyle}
        PreTag={preTag}
      >
        {codeString}
      </CodeHighlighter>
    </div>
  );
}
