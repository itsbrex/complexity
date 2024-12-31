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
  const codeString = selectedCodeBlock?.codeString ?? "";
  const language = getInterpretedCanvasLanguage(
    selectedCodeBlock?.language ?? "",
  );

  const lineNumberStyle = useMemo(() => {
    return {
      color: "oklch(var(--muted-foreground))",
      paddingLeft: "1rem",
    };
  }, []);

  return (
    <div
      id="canvas-code-view"
      className={cn(
        "tw-h-full tw-w-max tw-min-w-full [&>pre]:tw-m-0 [&>pre]:tw-size-full [&>pre]:tw-rounded-t-none [&_span]:tw-duration-300 [&_span]:tw-animate-in [&_span]:tw-fade-in",
      )}
    >
      <CodeHighlighter
        showLineNumbers
        showInlineLineNumbers
        wrapLines
        wrapLongLines
        language={language}
        lineNumberStyle={lineNumberStyle}
      >
        {codeString}
      </CodeHighlighter>
    </div>
  );
}
