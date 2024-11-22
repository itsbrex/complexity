import { sendMessage } from "webext-bridge/content-script";

import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import UiUtils from "@/utils/UiUtils";

type HighlightedCodeProps = {
  codeString: string;
  lang: string;
  isWrapped: boolean;
};

export function HighlightedCode({
  codeString,
  lang,
  isWrapped,
}: HighlightedCodeProps) {
  const settings = ExtensionLocalStorageService.getCachedSync();
  const [highlightedCode, setHighlightedCode] = useState<string | null>(null);

  const themeSettings = settings.plugins["thread:betterCodeBlocks"].theme;

  useEffect(() => {
    const highlightCode = async () => {
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
    };

    requestAnimationFrame(() => {
      highlightCode();
    });
  }, [codeString, lang, themeSettings]);

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
