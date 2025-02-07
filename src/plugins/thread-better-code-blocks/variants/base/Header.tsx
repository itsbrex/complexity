import CopyButton from "@/components/CopyButton";
import { Separator } from "@/components/ui/separator";
import { BetterCodeBlockFineGrainedOptions } from "@/data/dashboard/better-code-blocks/better-code-blocks-options.types";
import { useThreadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import { useMirroredCodeBlockContext } from "@/plugins/thread-better-code-blocks/MirroredCodeBlockContext";
import { getBetterCodeBlockOptions } from "@/plugins/thread-better-code-blocks/utils";
import CanvasSimpleModeRenderButton from "@/plugins/thread-better-code-blocks/variants/base/header-buttons/CanvasSimpleModeRenderButton";
import { ExpandCollapseButton } from "@/plugins/thread-better-code-blocks/variants/base/header-buttons/ExpandCollapseButton";
import { WrapToggleButton } from "@/plugins/thread-better-code-blocks/variants/base/header-buttons/WrapToggleButton";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";

const BaseCodeBlockWrapperHeader = memo(function BaseCodeBlockWrapperHeader() {
  const {
    codeBlock,
    sourceMessageBlockIndex,
    isWrapped,
    setIsWrapped,
    maxHeight,
    setMaxHeight,
  } = useMirroredCodeBlockContext();

  const language = codeBlock?.content.language ?? null;
  const isInFlight = codeBlock?.states.isInFlight ?? false;
  const code = codeBlock?.content.code ?? "";
  const isMessageBlockInFlight = useThreadMessageBlocksDomObserverStore(
    (store) =>
      store.messageBlocks?.[sourceMessageBlockIndex]?.states.isInFlight,
    deepEqual,
  );

  const fineGrainedSettings = getBetterCodeBlockOptions(language);
  const settings = ExtensionLocalStorageService.getCachedSync();

  const placeholderText:
    | BetterCodeBlockFineGrainedOptions["placeholderText"]
    | undefined = (fineGrainedSettings as BetterCodeBlockFineGrainedOptions)
    ?.placeholderText;

  const isSticky = fineGrainedSettings.stickyHeader;
  const isBottomBarSticky =
    settings.plugins["thread:betterMessageToolbars"].sticky;
  const [shouldShowWrapToggleButton] = useState(
    () =>
      fineGrainedSettings.unwrap.showToggleButton &&
      codeBlock &&
      isContainerHorizontalOverflowing({
        codeElement: codeBlock.nodes.$wrapper[0],
      }),
  );
  const [shouldShowExpandCollapseButton] = useState(
    () =>
      fineGrainedSettings.maxHeight.enabled &&
      fineGrainedSettings.maxHeight.showToggleButton &&
      codeBlock &&
      isContainerVerticalOverflowing({
        initialMaxHeight: fineGrainedSettings.maxHeight.value,
        codeElement: codeBlock.nodes.$wrapper[0],
      }),
  );

  if (!codeBlock) return null;

  return (
    <div
      className={cn(
        "x-flex x-items-center x-justify-between x-rounded-t-md x-border-b x-border-border/50 x-bg-secondary x-p-2 x-px-4 x-pb-2 x-text-muted-foreground",
        {
          "x-sticky": isSticky,
          "x-top-0": isSticky && (isMessageBlockInFlight || !isBottomBarSticky),
          "x-top-[var(--message-block-bottom-bar-height)]":
            isSticky && !isMessageBlockInFlight && isBottomBarSticky,
        },
      )}
    >
      <div className="x-flex x-items-center x-gap-2">
        <div className="x-line-clamp-1 x-font-mono x-text-sm">
          {placeholderText?.title || language}
        </div>
        {!isInFlight && placeholderText?.idle && (
          <div className="x-flex x-items-center x-gap-2">
            <Separator orientation="vertical" className="x-h-4 x-w-[2px]" />
            <div className="x-font-sans x-text-sm">{placeholderText.idle}</div>
          </div>
        )}
      </div>

      <div className="x-flex x-items-center x-gap-4">
        {!isInFlight && (
          <>
            <CanvasSimpleModeRenderButton />
            {maxHeight > 0 && shouldShowWrapToggleButton && (
              <WrapToggleButton
                isWrapped={isWrapped}
                setIsWrapped={setIsWrapped}
              />
            )}
            <CopyButton content={code} />
            {shouldShowExpandCollapseButton && (
              <ExpandCollapseButton
                defaultMaxHeight={fineGrainedSettings.maxHeight.value}
                maxHeight={maxHeight}
                setMaxHeight={setMaxHeight}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
});

export default BaseCodeBlockWrapperHeader;

function isContainerHorizontalOverflowing({
  codeElement,
}: {
  codeElement: Element;
}) {
  const $target = $(codeElement);

  if (!$target.length) {
    return false;
  }
  const targetWidth = $target[0].getBoundingClientRect().width;

  const parentElement = $target[0].parentElement;
  if (!parentElement) {
    return false;
  }
  const parentWidth = parentElement.getBoundingClientRect().width;

  return targetWidth > parentWidth;
}

function isContainerVerticalOverflowing({
  initialMaxHeight,
  codeElement,
}: {
  initialMaxHeight: number;
  codeElement: Element;
}) {
  const $target = $(codeElement);

  if (!$target.length) {
    return false;
  }
  const targetHeight = $target[0].getBoundingClientRect().height;

  return targetHeight > initialMaxHeight;
}
