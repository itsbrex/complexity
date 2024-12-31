import { memo } from "react";
import { LuLoaderCircle } from "react-icons/lu";

import CopyButton from "@/components/CopyButton";
import { Separator } from "@/components/ui/separator";
import { BetterCodeBlockFineGrainedOptions } from "@/data/dashboard/better-code-blocks/better-code-blocks-options.types";
import { useMirroredCodeBlockContext } from "@/features/plugins/thread/better-code-blocks/MirroredCodeBlockContext";
import useBetterCodeBlockOptions from "@/features/plugins/thread/better-code-blocks/useBetterCodeBlockOptions";
import CanvasSimpleModeRenderButton from "@/features/plugins/thread/better-code-blocks/variants/base/header-buttons/CanvasSimpleModeRenderButton";
import { ExpandCollapseButton } from "@/features/plugins/thread/better-code-blocks/variants/base/header-buttons/ExpandCollapseButton";
import { WrapToggleButton } from "@/features/plugins/thread/better-code-blocks/variants/base/header-buttons/WrapToggleButton";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";

const BaseCodeBlockWrapperHeader = memo(function BaseCodeBlockWrapperHeader() {
  const {
    language,
    codeString,
    isInFlight,
    isMessageBlockInFlight,
    codeElement,
    isWrapped,
    maxHeight,
    setIsWrapped,
    setMaxHeight,
  } = useMirroredCodeBlockContext()((state) => ({
    language: state.language,
    codeString: state.codeString,
    codeElement: state.codeElement,
    isInFlight: state.isInFlight,
    isMessageBlockInFlight: state.isMessageBlockInFlight,
    isWrapped: state.isWrapped,
    maxHeight: state.maxHeight,
    setIsWrapped: state.setIsWrapped,
    setMaxHeight: state.setMaxHeight,
  }));

  const settings = ExtensionLocalStorageService.getCachedSync();
  const fineGrainedSettings = useBetterCodeBlockOptions({ language });

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
      isContainerHorizontalOverflowing({ codeElement }),
  );
  const [shouldShowExpandCollapseButton] = useState(
    () =>
      fineGrainedSettings.maxHeight.enabled &&
      fineGrainedSettings.maxHeight.showToggleButton &&
      isContainerVerticalOverflowing({
        initialMaxHeight: fineGrainedSettings.maxHeight.value,
        codeElement,
      }),
  );

  return (
    <div
      className={cn(
        "tw-flex tw-items-center tw-justify-between tw-rounded-t-md tw-border-b tw-border-border/50 tw-bg-secondary tw-p-2 tw-px-4 tw-pb-2 tw-text-muted-foreground",
        {
          "tw-sticky": isSticky,
          "tw-top-[calc(var(--navbar-height))]":
            isSticky && (isMessageBlockInFlight || !isBottomBarSticky),
          "tw-top-[calc(var(--navbar-height)+var(--message-block-bottom-bar-height))]":
            isSticky && !isMessageBlockInFlight && isBottomBarSticky,
        },
      )}
    >
      <div className="tw-flex tw-items-center tw-gap-2">
        <div className="tw-line-clamp-1 tw-font-mono tw-text-sm">
          {placeholderText?.title || language}
        </div>
        {!isInFlight && placeholderText?.idle && (
          <div className="tw-flex tw-items-center tw-gap-2">
            <Separator orientation="vertical" className="tw-h-4 tw-w-[2px]" />
            <div className="tw-font-sans tw-text-sm">
              {placeholderText.idle}
            </div>
          </div>
        )}
      </div>

      <div className="tw-flex tw-items-center tw-gap-4">
        {isInFlight && (
          <span className="tw-flex tw-items-center tw-gap-2">
            {placeholderText?.loading && (
              <span className="tw-animate-pulse tw-font-sans">
                {placeholderText.loading}
              </span>
            )}
            <LuLoaderCircle className="tw-animate-spin" />
          </span>
        )}
        {!isInFlight && (
          <>
            <CanvasSimpleModeRenderButton />
            {maxHeight > 0 && shouldShowWrapToggleButton && (
              <WrapToggleButton
                isWrapped={isWrapped}
                setIsWrapped={setIsWrapped}
              />
            )}
            <CopyButton content={codeString} />
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
