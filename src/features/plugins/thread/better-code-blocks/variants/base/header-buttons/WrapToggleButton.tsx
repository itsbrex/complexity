import { Dispatch, SetStateAction } from "react";
import { LuAlignJustify, LuWrapText } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";

type WrapToggleButtonProps = {
  isWrapped: boolean;
  setIsWrapped: Dispatch<SetStateAction<boolean>>;
};

export function WrapToggleButton({
  isWrapped,
  setIsWrapped,
}: WrapToggleButtonProps) {
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
