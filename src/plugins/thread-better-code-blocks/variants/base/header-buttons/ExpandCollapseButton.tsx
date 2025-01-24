import { LuChevronDown, LuChevronUp } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";

type ExpandCollapseButtonProps = {
  defaultMaxHeight: number;
  maxHeight: number;
  setMaxHeight: (maxHeight: number) => void;
};

export function ExpandCollapseButton({
  defaultMaxHeight,
  maxHeight,
  setMaxHeight,
}: ExpandCollapseButtonProps) {
  return (
    <Tooltip
      content={
        maxHeight === defaultMaxHeight
          ? t("plugin-better-code-blocks:headerButtons.expand.expand")
          : t("plugin-better-code-blocks:headerButtons.expand.collapse")
      }
    >
      <div
        className="tw-cursor-pointer tw-text-muted-foreground tw-transition-colors hover:tw-text-foreground"
        onClick={() =>
          setMaxHeight(maxHeight === defaultMaxHeight ? 9999 : defaultMaxHeight)
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
