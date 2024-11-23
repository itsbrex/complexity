import { Dispatch, memo, SetStateAction } from "react";
import {
  LuAlignJustify,
  LuLoader2,
  LuMaximize2,
  LuMinimize2,
  LuWrapText,
} from "react-icons/lu";

import CopyButton from "@/components/CopyButton";
import Tooltip from "@/components/Tooltip";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { DOM_INTERNAL_SELECTORS } from "@/utils/dom-selectors";

type BetterCodeBlockHeaderProps = {
  lang: string;
  codeString: string;
  isInFlight: boolean;
  isMessageBlockInFlight: boolean;
  messageBlockIndex: number;
  codeBlockIndex: number;
  isWrapped: boolean;
  setIsWrapped: Dispatch<SetStateAction<boolean>>;
  maxHeight: number;
  setMaxHeight: Dispatch<SetStateAction<number>>;
};

const BetterCodeBlockHeader = memo(function BetterCodeBlockHeader({
  lang,
  codeString,
  isInFlight,
  isMessageBlockInFlight,
  messageBlockIndex,
  codeBlockIndex,
  isWrapped,
  setIsWrapped,
  maxHeight,
  setMaxHeight,
}: BetterCodeBlockHeaderProps) {
  const settings = ExtensionLocalStorageService.getCachedSync();

  const isSticky = settings.plugins["thread:betterCodeBlocks"].stickyHeader;
  const isBottomButtonBarSticky =
    settings.plugins["thread:betterMessageToolbars"].sticky;

  const shouldShowWrapToggleButton = useRef(
    settings.plugins["thread:betterCodeBlocks"].unwrap.showToggleButton &&
      isContainerHorizontalOverflowing({
        messageBlockIndex,
        codeBlockIndex,
      }),
  ).current;

  const shouldShowExpandCollapseButton = useRef(
    settings.plugins["thread:betterCodeBlocks"].maxHeight.showToggleButton &&
      isContainerVerticalOverflowing({
        initialMaxHeight:
          settings.plugins["thread:betterCodeBlocks"].maxHeight.value,
        messageBlockIndex,
        codeBlockIndex,
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

export default BetterCodeBlockHeader;

function WrapToggleButton({
  isWrapped,
  setIsWrapped,
}: {
  isWrapped: boolean;
  setIsWrapped: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Tooltip content={isWrapped ? "Unwrap lines" : "Wrap lines"}>
      <div
        className="tw-cursor-pointer tw-text-muted-foreground tw-transition-colors hover:tw-text-foreground"
        onClick={() => setIsWrapped((prev) => !prev)}
      >
        {isWrapped ? (
          <LuAlignJustify className="tw-size-4" />
        ) : (
          <LuWrapText className="tw-size-4" />
        )}
      </div>
    </Tooltip>
  );
}

function ExpandCollapseButton({
  maxHeight,
  setMaxHeight,
}: {
  maxHeight: number;
  setMaxHeight: Dispatch<SetStateAction<number>>;
}) {
  const settings = ExtensionLocalStorageService.getCachedSync();
  const defaultMaxHeight =
    settings.plugins["thread:betterCodeBlocks"].maxHeight.value;

  return (
    <Tooltip content={maxHeight === defaultMaxHeight ? "Expand" : "Collapse"}>
      <div
        className="tw-cursor-pointer tw-text-muted-foreground tw-transition-colors hover:tw-text-foreground"
        onClick={() =>
          setMaxHeight((prev) =>
            prev === defaultMaxHeight ? 9999 : defaultMaxHeight,
          )
        }
      >
        {maxHeight === defaultMaxHeight ? <LuMaximize2 /> : <LuMinimize2 />}
      </div>
    </Tooltip>
  );
}

function isContainerHorizontalOverflowing({
  messageBlockIndex,
  codeBlockIndex,
}: {
  messageBlockIndex: number;
  codeBlockIndex: number;
}) {
  const targetSelector = `${DOM_INTERNAL_SELECTORS.THREAD.MESSAGE.BLOCK}[data-index="${messageBlockIndex}"] ${DOM_INTERNAL_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.CODE_BLOCK}[data-index="${codeBlockIndex}"] code`;

  const targetElement = document.querySelector(targetSelector);
  if (!targetElement) {
    return false;
  }
  const targetWidth = targetElement.getBoundingClientRect().width;

  const parentElement = targetElement.parentElement;
  if (!parentElement) {
    return false;
  }
  const parentWidth = parentElement.getBoundingClientRect().width;

  return targetWidth > parentWidth;
}

function isContainerVerticalOverflowing({
  initialMaxHeight,
  messageBlockIndex,
  codeBlockIndex,
}: {
  initialMaxHeight: number;
  messageBlockIndex: number;
  codeBlockIndex: number;
}) {
  const targetSelector = `${DOM_INTERNAL_SELECTORS.THREAD.MESSAGE.BLOCK}[data-index="${messageBlockIndex}"] ${DOM_INTERNAL_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.CODE_BLOCK}[data-index="${codeBlockIndex}"] code`;

  const targetElement = document.querySelector(targetSelector);
  if (!targetElement) {
    return false;
  }
  const targetHeight = targetElement.getBoundingClientRect().height;

  return targetHeight > initialMaxHeight;
}
