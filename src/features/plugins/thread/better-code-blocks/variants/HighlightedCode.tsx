import { sendMessage } from "webext-bridge/content-script";

import { CallbackQueue } from "@/features/plugins/_core/dom-observer/callback-queue";
import { useMirroredCodeBlockContext } from "@/features/plugins/thread/better-code-blocks/MirroredCodeBlockContext";
import useBetterCodeBlockOptions from "@/features/plugins/thread/better-code-blocks/useBetterCodeBlockOptions";

const HighlightedCodeWrapper = memo(() => {
  const { maxHeight, isWrapped, language, codeElement, codeString } =
    useMirroredCodeBlockContext()((state) => ({
      codeElement: state.codeElement,
      codeString: state.codeString,
      language: state.language,
      maxHeight: state.maxHeight,
      isWrapped: state.isWrapped,
    }));

  const isThemeEnabled = useBetterCodeBlockOptions({ language })?.theme.enabled;
  const [fallbackCodeHtml, setFallbackCodeHtml] = useState<string>(codeString);

  useEffect(() => {
    if (!isThemeEnabled) {
      const fallback = getNativeCodeBlockHtml(codeElement);
      setFallbackCodeHtml(fallback ?? codeString);
    }
  }, [codeElement, isThemeEnabled, codeString]);

  return (
    <div
      style={{
        maxHeight,
      }}
      className="tw-overflow-auto tw-rounded-b-md"
    >
      {isThemeEnabled ? (
        <HighlightedCode />
      ) : (
        <div
          className={cn(
            "tw-m-0 tw-whitespace-pre tw-p-2 tw-px-2 [&>*]:!tw-select-auto",
            {
              "tw-whitespace-pre-wrap": isWrapped,
            },
          )}
          dangerouslySetInnerHTML={{ __html: fallbackCodeHtml }}
        />
      )}
    </div>
  );
});

export default HighlightedCodeWrapper;

const HighlightedCode = memo(() => {
  const {
    codeString,
    language,
    sourceMessageBlockIndex,
    sourceCodeBlockIndex,
    isWrapped,
  } = useMirroredCodeBlockContext()((state) => ({
    codeString: state.codeString,
    language: state.language,
    sourceMessageBlockIndex: state.sourceMessageBlockIndex,
    sourceCodeBlockIndex: state.sourceCodeBlockIndex,
    isWrapped: state.isWrapped,
  }));

  const [highlightedCode, setHighlightedCode] = useState<string | null>(null);

  const themeSettings = useBetterCodeBlockOptions({ language }).theme;

  useEffect(() => {
    CallbackQueue.getInstance().enqueue(async () => {
      const highlighted = await sendMessage(
        "codeHighlighter:getHighlightedCodeAsHtml",
        {
          codeString,
          language,
          themes: {
            light: themeSettings.light,
            dark: themeSettings.dark,
          },
        },
        "window",
      );

      setHighlightedCode(highlighted);
    }, `highlight-code-block-${sourceMessageBlockIndex}-${sourceCodeBlockIndex}`);
  }, [
    codeString,
    language,
    sourceCodeBlockIndex,
    sourceMessageBlockIndex,
    themeSettings,
  ]);

  if (!highlightedCode) {
    return (
      <pre
        className={cn("tw-m-0 tw-p-2 tw-px-4", {
          "tw-whitespace-pre-wrap": isWrapped,
        })}
      >
        {codeString}
      </pre>
    );
  }

  return (
    <div
      className={cn(
        "[&>pre]:tw-m-0 [&>pre]:tw-rounded-t-none [&>pre]:tw-p-2 [&>pre]:tw-px-4",
        {
          "[&_code]:tw-whitespace-pre-wrap": isWrapped,
        },
      )}
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
    />
  );
});

function getNativeCodeBlockHtml(code: Element) {
  const $target = $(code);

  if (!$target.length) return null;

  const html = $target.html();

  if (html.length === 0) return null;

  return html;
}
