import { Dispatch, SetStateAction } from "react";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";

type ExpandCollapseButtonProps = {
  defaultMaxHeight: number;
  maxHeight: number;
  setMaxHeight: Dispatch<SetStateAction<number>>;
};

export function ExpandCollapseButton({
  defaultMaxHeight,
  maxHeight,
  setMaxHeight,
}: ExpandCollapseButtonProps) {
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
        {maxHeight === defaultMaxHeight ? (
          <LuChevronDown className="tw-size-4" />
        ) : (
          <LuChevronUp className="tw-size-4" />
        )}
      </div>
    </Tooltip>
  );
}
