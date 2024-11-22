import { Dispatch, SetStateAction } from "react";
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

type BetterCodeBlockHeaderProps = {
  lang: string;
  codeString: string;
  isInFlight: boolean;
  isMessageBlockInFlight: boolean;
  isWrapped: boolean;
  setIsWrapped: Dispatch<SetStateAction<boolean>>;
  maxHeight: number;
  setMaxHeight: Dispatch<SetStateAction<number>>;
};

export function BetterCodeBlockHeader({
  lang,
  codeString,
  isInFlight,
  isMessageBlockInFlight,
  isWrapped,
  setIsWrapped,
  maxHeight,
  setMaxHeight,
}: BetterCodeBlockHeaderProps) {
  const settings = ExtensionLocalStorageService.getCachedSync();
  const isSticky = settings.plugins["thread:betterCodeBlocks"].stickyHeader;
  const isBottomButtonBarSticky =
    settings.plugins["thread:betterMessageToolbars"].sticky;

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
            {settings.plugins["thread:betterCodeBlocks"].unwrap
              .showToggleButton && (
              <WrapToggleButton
                isWrapped={isWrapped}
                setIsWrapped={setIsWrapped}
              />
            )}
            {settings.plugins["thread:betterCodeBlocks"].maxHeight
              .showToggleButton && (
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
}

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
