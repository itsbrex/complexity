import { CSSProperties, ReactNode } from "react";

import CodeHighlighter from "@/components/CodeHighlighter";
import { getInterpretedCanvasLanguage } from "@/plugins/canvas/canvas.types";
import { useCanvasStore } from "@/plugins/canvas/store";
import {
  useMirroredCodeBlocksStore,
  getMirroredCodeBlockByLocation,
} from "@/plugins/thread-better-code-blocks/store";

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
      <pre className="x-px-4 x-py-2">{children}</pre>
    );
    PreComponent.displayName = "PreTag";
    return PreComponent;
  }, []);

  return (
    <div
      id="canvas-code-view"
      className={cn(
        "x-h-full x-w-max x-min-w-full x-text-xs [&>pre]:x-m-0 [&>pre]:x-size-full [&>pre]:x-rounded-t-none [&_span.linenumber]:!x-text-muted-foreground",
        {
          "[&_span]:x-duration-300 [&_span]:x-animate-in [&_span]:x-fade-in":
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
