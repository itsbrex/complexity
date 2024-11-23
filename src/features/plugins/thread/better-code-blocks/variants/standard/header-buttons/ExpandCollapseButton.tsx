import { Dispatch, SetStateAction } from "react";
import { LuMaximize2, LuMinimize2 } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";

type ExpandCollapseButtonProps = {
  maxHeight: number;
  setMaxHeight: Dispatch<SetStateAction<number>>;
};

export function ExpandCollapseButton({
  maxHeight,
  setMaxHeight,
}: ExpandCollapseButtonProps) {
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
