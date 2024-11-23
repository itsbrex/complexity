import { memo } from "react";

import BetterCodeBlockHeader from "@/features/plugins/thread/better-code-blocks/Header";
import { HighlightedCode } from "@/features/plugins/thread/better-code-blocks/HighlightedCode";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { DOM_INTERNAL_SELECTORS } from "@/utils/dom-selectors";

type MirroredCodeBlockProps = {
  lang: string;
  codeString: string;
  messageBlockIndex: number;
  codeBlockIndex: number;
  isInFlight: boolean;
  isMessageBlockInFlight: boolean;
};

export const MirroredCodeBlock = memo(function MirroredCodeBlock({
  lang,
  codeString,
  messageBlockIndex,
  codeBlockIndex,
  isInFlight,
  isMessageBlockInFlight,
}: MirroredCodeBlockProps) {
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
      const fallback = getNativeCodeBlockHtml({
        messageBlockIndex,
        codeBlockIndex,
      });
      setFallbackCodeHtml(fallback ?? codeString);
    }
  }, [messageBlockIndex, codeBlockIndex, isThemeEnabled, codeString]);

  return (
    <div className="tw-relative tw-my-4 tw-flex tw-flex-col tw-rounded-md tw-border tw-border-border/50 tw-bg-secondary tw-font-mono">
      <BetterCodeBlockHeader
        lang={lang}
        codeString={codeString}
        messageBlockIndex={messageBlockIndex}
        codeBlockIndex={codeBlockIndex}
        isInFlight={isInFlight}
        isMessageBlockInFlight={isMessageBlockInFlight}
        isWrapped={isWrapped}
        setIsWrapped={setIsWrapped}
        maxHeight={maxHeight}
        setMaxHeight={setMaxHeight}
      />
      <div style={{ maxHeight: maxHeight }} className="tw-overflow-auto">
        {isThemeEnabled ? (
          <HighlightedCode
            codeString={codeString}
            lang={lang}
            isWrapped={isWrapped}
          />
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

function getNativeCodeBlockHtml({
  messageBlockIndex,
  codeBlockIndex,
}: {
  messageBlockIndex: number;
  codeBlockIndex: number;
}) {
  const selector = `${DOM_INTERNAL_SELECTORS.THREAD.MESSAGE.BLOCK}[data-index="${messageBlockIndex}"] ${DOM_INTERNAL_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.CODE_BLOCK}[data-index="${codeBlockIndex}"] code`;

  const $nativeCodeBlock = $(selector);

  if (!$nativeCodeBlock.length) return null;

  const html = $nativeCodeBlock.html();

  if (html.length === 0) return null;

  return html;
}
