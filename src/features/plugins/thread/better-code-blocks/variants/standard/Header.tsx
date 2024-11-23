import { Dispatch, memo, SetStateAction, useRef } from "react";
import { LuLoader2 } from "react-icons/lu";

import CopyButton from "@/components/CopyButton";
import { useMirroredCodeBlockContext } from "@/features/plugins/thread/better-code-blocks/MirroredCodeBlockContext";
import { ExpandCollapseButton } from "@/features/plugins/thread/better-code-blocks/variants/standard/header-buttons/ExpandCollapseButton";
import { WrapToggleButton } from "@/features/plugins/thread/better-code-blocks/variants/standard/header-buttons/WrapToggleButton";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";

type StandardHeaderProps = {
  isWrapped: boolean;
  setIsWrapped: Dispatch<SetStateAction<boolean>>;
  maxHeight: number;
  setMaxHeight: Dispatch<SetStateAction<number>>;
};

const StandardCodeBlockHeader = memo(function StandardCodeBlockHeader({
  isWrapped,
  setIsWrapped,
  maxHeight,
  setMaxHeight,
}: StandardHeaderProps) {
  const { lang, codeString, isInFlight, isMessageBlockInFlight, codeElement } =
    useMirroredCodeBlockContext()((state) => ({
      lang: state.lang,
      codeString: state.codeString,
      codeElement: state.codeElement,
      isInFlight: state.isInFlight,
      isMessageBlockInFlight: state.isMessageBlockInFlight,
    }));

  const settings = ExtensionLocalStorageService.getCachedSync();

  const isSticky = settings.plugins["thread:betterCodeBlocks"].stickyHeader;
  const isBottomButtonBarSticky =
    settings.plugins["thread:betterMessageToolbars"].sticky;
  const shouldShowWrapToggleButton = useRef(
    settings.plugins["thread:betterCodeBlocks"].unwrap.showToggleButton &&
      isContainerHorizontalOverflowing({ codeElement }),
  ).current;
  const shouldShowExpandCollapseButton = useRef(
    settings.plugins["thread:betterCodeBlocks"].maxHeight.showToggleButton &&
      isContainerVerticalOverflowing({
        initialMaxHeight:
          settings.plugins["thread:betterCodeBlocks"].maxHeight.value,
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
            isSticky && (isMessageBlockInFlight || !isBottomButtonBarSticky),
          "tw-top-[calc(var(--navbar-height)+var(--message-block-bottom-button-bar-height))]":
            isSticky && !isMessageBlockInFlight && isBottomButtonBarSticky,
        },
      )}
    >
      <div className="tw-font-mono tw-text-sm">{lang}</div>
      <div className="tw-flex tw-items-center tw-gap-4">
        {isInFlight && <LuLoader2 className="tw-animate-spin" />}
        {!isInFlight && (
          <>
            {shouldShowWrapToggleButton && (
              <WrapToggleButton
                isWrapped={isWrapped}
                setIsWrapped={setIsWrapped}
              />
            )}
            {shouldShowExpandCollapseButton && (
              <ExpandCollapseButton
                maxHeight={maxHeight}
                setMaxHeight={setMaxHeight}
              />
            )}
            <CopyButton content={codeString} />
          </>
        )}
      </div>
    </div>
  );
});

export default StandardCodeBlockHeader;

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
