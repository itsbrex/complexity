import { Dispatch, memo, SetStateAction, useRef } from "react";
import { LuLoader2 } from "react-icons/lu";

import CopyButton from "@/components/CopyButton";
import { Separator } from "@/components/ui/separator";
import { BetterCodeBlockFineGrainedOptions } from "@/data/better-code-blocks/better-code-blocks-options";
import { useMirroredCodeBlockContext } from "@/features/plugins/thread/better-code-blocks/MirroredCodeBlockContext";
import { ExpandCollapseButton } from "@/features/plugins/thread/better-code-blocks/variants/base/header-buttons/ExpandCollapseButton";
import useBetterCodeBlockOptions from "@/features/plugins/thread/better-code-blocks/variants/base/header-buttons/useBetterCodeBlockOptions";
import { WrapToggleButton } from "@/features/plugins/thread/better-code-blocks/variants/base/header-buttons/WrapToggleButton";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";

type BaseHeaderProps = {
  isWrapped: boolean;
  setIsWrapped: Dispatch<SetStateAction<boolean>>;
  maxHeight: number;
  setMaxHeight: Dispatch<SetStateAction<number>>;
};

const BaseCodeBlockWrapperHeader = memo(function BaseCodeBlockWrapperHeader({
  isWrapped,
  setIsWrapped,
  maxHeight,
  setMaxHeight,
}: BaseHeaderProps) {
  const {
    language,
    codeString,
    isInFlight,
    isMessageBlockInFlight,
    codeElement,
  } = useMirroredCodeBlockContext()((state) => ({
    language: state.lang,
    codeString: state.codeString,
    codeElement: state.codeElement,
    isInFlight: state.isInFlight,
    isMessageBlockInFlight: state.isMessageBlockInFlight,
  }));

  const settings = useBetterCodeBlockOptions({ language });

  const placeholderText:
    | BetterCodeBlockFineGrainedOptions["placeholderText"]
    | undefined = (settings as BetterCodeBlockFineGrainedOptions)
    ?.placeholderText;

  const isSticky = settings.stickyHeader;
  const isBottomBarSticky =
    ExtensionLocalStorageService.getCachedSync().plugins[
      "thread:betterMessageToolbars"
    ].sticky;
  const shouldShowWrapToggleButton = useRef(
    settings.unwrap.showToggleButton &&
      isContainerHorizontalOverflowing({ codeElement }),
  ).current;
  const shouldShowExpandCollapseButton = useRef(
    settings.maxHeight.showToggleButton &&
      isContainerVerticalOverflowing({
        initialMaxHeight: settings.maxHeight.value,
        codeElement,
      }),
  ).current;

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
        <div className="tw-font-mono tw-text-sm">
          {placeholderText?.title ?? language}
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
            <LuLoader2 className="tw-animate-spin" />
          </span>
        )}
        {!isInFlight && (
          <>
            {maxHeight > 0 && shouldShowWrapToggleButton && (
              <WrapToggleButton
                isWrapped={isWrapped}
                setIsWrapped={setIsWrapped}
              />
            )}
            <CopyButton content={codeString} />
            {shouldShowExpandCollapseButton && (
              <ExpandCollapseButton
                defaultMaxHeight={settings.maxHeight.value}
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
