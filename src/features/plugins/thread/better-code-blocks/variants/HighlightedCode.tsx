import { sendMessage } from "webext-bridge/content-script";

import { CallbackQueue } from "@/features/plugins/_core/dom-observer/callback-queue";
import { useMirroredCodeBlockContext } from "@/features/plugins/thread/better-code-blocks/MirroredCodeBlockContext";
import useBetterCodeBlockOptions from "@/features/plugins/thread/better-code-blocks/variants/base/header-buttons/useBetterCodeBlockOptions";
import UiUtils from "@/utils/UiUtils";

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
      const theme = themeSettings[UiUtils.isDarkTheme() ? "dark" : "light"];

      const highlighted = await sendMessage(
        "codeHighlighter:getHighlightedCodeAsHtml",
        {
          codeString,
          language,
          theme,
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

export default HighlightedCode;
