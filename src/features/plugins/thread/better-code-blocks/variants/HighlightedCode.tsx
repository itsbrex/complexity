import { sendMessage } from "webext-bridge/content-script";

import { CallbackQueue } from "@/features/plugins/_core/dom-observer/callback-queue";
import { useMirroredCodeBlockContext } from "@/features/plugins/thread/better-code-blocks/MirroredCodeBlockContext";
import useBetterCodeBlockOptions from "@/features/plugins/thread/better-code-blocks/variants/standard/header-buttons/useBetterCodeBlockOptions";
import UiUtils from "@/utils/UiUtils";

type HighlightedCodeProps = {
  isWrapped: boolean;
};

export function HighlightedCode({ isWrapped }: HighlightedCodeProps) {
  const { codeString, lang, sourceMessageBlockIndex, sourceCodeBlockIndex } =
    useMirroredCodeBlockContext()((state) => ({
      codeString: state.codeString,
      lang: state.lang,
      sourceMessageBlockIndex: state.sourceMessageBlockIndex,
      sourceCodeBlockIndex: state.sourceCodeBlockIndex,
    }));

  const settings = useBetterCodeBlockOptions({ language: lang });
  const [highlightedCode, setHighlightedCode] = useState<string | null>(null);

  const themeSettings = settings.theme;

  useEffect(() => {
    CallbackQueue.getInstance().enqueue(async () => {
      const theme = themeSettings[UiUtils.isDarkTheme() ? "dark" : "light"];

      const highlighted = await sendMessage(
        "codeHighlighter:getHighlightedCodeAsHtml",
        {
          codeString,
          lang,
          theme,
        },
        "window",
      );

      setHighlightedCode(highlighted);
    }, `highlight-code-block-${sourceMessageBlockIndex}-${sourceCodeBlockIndex}`);
  }, [
    codeString,
    lang,
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
}
