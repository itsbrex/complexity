import { ReactNode } from "react";

import CodeHighlighter from "@/components/CodeHighlighter";
import { getInterpretedCanvasLanguage } from "@/plugins/canvas/canvas.types";
import { useMirroredCodeBlockContext } from "@/plugins/thread-better-code-blocks/MirroredCodeBlockContext";

const HighlightedCodeWrapper = memo(() => {
  const { codeBlock, maxHeight, isWrapped } = useMirroredCodeBlockContext();

  const isInFlight = codeBlock?.states.isInFlight;
  const code = codeBlock?.content.code ?? "";
  const language = codeBlock?.content.language;

  const interpretedLanguage = getInterpretedCanvasLanguage(language ?? "text");

  if (!codeBlock) return null;

  return (
    <div
      style={{
        maxHeight,
      }}
      className="x-overflow-auto x-rounded-b-md"
    >
      <div
        className={cn(
          "[&>pre]:x-m-0 [&>pre]:x-rounded-t-none [&>pre]:!x-p-2 [&>pre]:!x-px-4",
          {
            "[&_code]:!x-whitespace-pre-wrap": isWrapped,
            "[&_span]:x-duration-300 [&_span]:x-animate-in [&_span]:x-fade-in":
              isInFlight,
          },
        )}
      >
        <CodeHighlighter language={interpretedLanguage} PreTag={PreTag}>
          {code}
        </CodeHighlighter>
      </div>
    </div>
  );
});

function PreTag({ children }: { children: ReactNode }) {
  return <pre className="x-px-4 x-py-2">{children}</pre>;
}

export default HighlightedCodeWrapper;
