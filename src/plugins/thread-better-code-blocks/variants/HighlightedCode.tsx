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
      <pre className="tw-px-4 tw-py-2">{children}</pre>
    );
    PreComponent.displayName = "PreTag";
    return PreComponent;
  }, []);

  return (
    <div
      style={{
        maxHeight,
      }}
      className="tw-overflow-auto tw-rounded-b-md"
    >
      <div
        className={cn(
          "[&>pre]:tw-m-0 [&>pre]:tw-rounded-t-none [&>pre]:!tw-p-2 [&>pre]:!tw-px-4",
          {
            "[&_code]:!tw-whitespace-pre-wrap": isWrapped,
            "[&_span]:tw-duration-300 [&_span]:tw-animate-in [&_span]:tw-fade-in":
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
