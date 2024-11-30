import { useMirroredCodeBlockContext } from "@/features/plugins/thread/better-code-blocks/MirroredCodeBlockContext";
import BetterCodeBlockHeader from "@/features/plugins/thread/better-code-blocks/variants/base/Header";
import useBetterCodeBlockOptions from "@/features/plugins/thread/better-code-blocks/variants/base/header-buttons/useBetterCodeBlockOptions";
import { HighlightedCode } from "@/features/plugins/thread/better-code-blocks/variants/HighlightedCode";

export const BaseCodeBlockWrapper = memo(function BaseCodeBlockWrapper() {
  const { codeString, codeElement, language } = useMirroredCodeBlockContext()(
    (state) => ({
      codeString: state.codeString,
      codeElement: state.codeElement,
      language: state.lang,
    }),
  );

  const settings = useBetterCodeBlockOptions({ language });

  const [isWrapped, setIsWrapped] = useState(!settings.unwrap.enabled);
  const [maxHeight, setMaxHeight] = useState(
    settings.maxHeight.enabled ? settings.maxHeight.value : 9999,
  );

  const isThemeEnabled = settings?.theme.enabled;
  const [fallbackCodeHtml, setFallbackCodeHtml] = useState<string>(codeString);

  useEffect(() => {
    if (!isThemeEnabled) {
      const fallback = getNativeCodeBlockHtml(codeElement);
      setFallbackCodeHtml(fallback ?? codeString);
    }
  }, [codeElement, isThemeEnabled, codeString]);

  return (
    <div
      className={cn(
        "tw-relative tw-my-4 tw-flex tw-flex-col tw-rounded-md tw-border tw-border-border/50 tw-bg-secondary tw-font-mono",
        {
          "tw-overflow-hidden": maxHeight === 0,
        },
      )}
    >
      <BetterCodeBlockHeader
        isWrapped={isWrapped}
        setIsWrapped={setIsWrapped}
        maxHeight={maxHeight}
        setMaxHeight={setMaxHeight}
      />
      <div
        style={{
          maxHeight,
        }}
        className="tw-overflow-auto tw-rounded-b-md"
      >
        {isThemeEnabled ? (
          <HighlightedCode isWrapped={isWrapped} />
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
    </div>
  );
});

function getNativeCodeBlockHtml(code: Element) {
  const $target = $(code);

  if (!$target.length) return null;

  const html = $target.html();

  if (html.length === 0) return null;

  return html;
}
