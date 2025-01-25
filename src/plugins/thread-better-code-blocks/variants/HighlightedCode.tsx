import { ReactNode } from "react";

import CodeHighlighter from "@/components/CodeHighlighter";
import { getInterpretedCanvasLanguage } from "@/plugins/canvas/canvas.types";
import { useMirroredCodeBlockContext } from "@/plugins/thread-better-code-blocks/MirroredCodeBlockContext";

const HighlightedCodeWrapper = memo(() => {
  const { maxHeight, isWrapped, codeString, language, isInFlight } =
    useMirroredCodeBlockContext()((state) => ({
      codeElement: state.codeElement,
      codeString: state.codeString,
      language: state.language,
      maxHeight: state.maxHeight,
      isWrapped: state.isWrapped,
      isInFlight: state.isInFlight,
    }));

  const interpretedLanguage = getInterpretedCanvasLanguage(language ?? "text");

  const preTag = useMemo(() => {
    const PreComponent = ({ children }: { children: ReactNode }) => (
      <pre className="x-px-4 x-py-2">{children}</pre>
    );
    PreComponent.displayName = "PreTag";
    return PreComponent;
  }, []);

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
        <CodeHighlighter language={interpretedLanguage} PreTag={preTag}>
          {codeString}
        </CodeHighlighter>
      </div>
    </div>
  );
});

export default HighlightedCodeWrapper;
