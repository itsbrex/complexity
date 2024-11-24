import { useMirroredCodeBlockContext } from "@/features/plugins/thread/better-code-blocks/MirroredCodeBlockContext";
import { HighlightedCode } from "@/features/plugins/thread/better-code-blocks/variants/HighlightedCode";
import BetterCodeBlockHeader from "@/features/plugins/thread/better-code-blocks/variants/standard/Header";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";

export const StandardCodeBlock = memo(function StandardCodeBlock() {
  const { codeString, codeElement } = useMirroredCodeBlockContext()(
    (state) => ({
      codeString: state.codeString,
      codeElement: state.codeElement,
    }),
  );
  const settings = ExtensionLocalStorageService.getCachedSync();
  const [isWrapped, setIsWrapped] = useState(
    !settings.plugins["thread:betterCodeBlocks"].unwrap.enabled,
  );
  const [maxHeight, setMaxHeight] = useState(
    settings.plugins["thread:betterCodeBlocks"].maxHeight.enabled
      ? settings.plugins["thread:betterCodeBlocks"].maxHeight.value
      : 9999,
  );
  const isThemeEnabled =
    settings.plugins["thread:betterCodeBlocks"].theme.enabled;
  const [fallbackCodeHtml, setFallbackCodeHtml] = useState<string>(codeString);

  useEffect(() => {
    if (!isThemeEnabled) {
      const fallback = getNativeCodeBlockHtml(codeElement);
      setFallbackCodeHtml(fallback ?? codeString);
    }
  }, [codeElement, isThemeEnabled, codeString]);

  return (
    <div className="tw-relative tw-my-4 tw-flex tw-flex-col tw-rounded-md tw-border tw-border-border/50 tw-bg-secondary tw-font-mono">
      <BetterCodeBlockHeader
        isWrapped={isWrapped}
        setIsWrapped={setIsWrapped}
        maxHeight={maxHeight}
        setMaxHeight={setMaxHeight}
      />
      <div style={{ maxHeight: maxHeight }} className="tw-overflow-auto">
        {isThemeEnabled ? (
          <HighlightedCode isWrapped={isWrapped} />
        ) : (
          <div
            className={cn("tw-m-0 tw-p-2 tw-px-2 [&>*]:!tw-select-auto", {
              "tw-whitespace-pre-wrap": isWrapped,
            })}
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
