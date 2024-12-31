import CodeHighlighter from "@/components/CodeHighlighter";
import { useMirroredCodeBlockContext } from "@/features/plugins/thread/better-code-blocks/MirroredCodeBlockContext";
import { getInterpretedCanvasLanguage } from "@/features/plugins/thread/canvas/canvas.types";

const HighlightedCodeWrapper = memo(() => {
  const { maxHeight, isWrapped, codeString, language } =
    useMirroredCodeBlockContext()((state) => ({
      codeElement: state.codeElement,
      codeString: state.codeString,
      language: state.language,
      maxHeight: state.maxHeight,
      isWrapped: state.isWrapped,
    }));

  const interpretedLanguage = getInterpretedCanvasLanguage(language ?? "text");

  return (
    <div
      style={{
        maxHeight,
      }}
      className="tw-overflow-auto tw-rounded-b-md"
    >
      <div
        className={cn(
          "[&>pre]:tw-m-0 [&>pre]:tw-rounded-t-none [&>pre]:!tw-p-2 [&>pre]:!tw-px-4 [&_span]:tw-duration-300 [&_span]:tw-animate-in [&_span]:tw-fade-in",
          {
            "[&_code]:!tw-whitespace-pre-wrap": isWrapped,
          },
        )}
      >
        <CodeHighlighter language={interpretedLanguage}>
          {codeString}
        </CodeHighlighter>
      </div>
    </div>
  );
});

export default HighlightedCodeWrapper;
