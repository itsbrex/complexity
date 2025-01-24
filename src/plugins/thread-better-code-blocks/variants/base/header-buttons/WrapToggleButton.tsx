import { LuAlignJustify, LuWrapText } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";

type WrapToggleButtonProps = {
  isWrapped: boolean;
  setIsWrapped: (isWrapped: boolean) => void;
};

export function WrapToggleButton({
  isWrapped,
  setIsWrapped,
}: WrapToggleButtonProps) {
  return (
    <Tooltip
      content={
        isWrapped
          ? t("plugin-better-code-blocks:headerButtons.wrap.unwrap")
          : t("plugin-better-code-blocks:headerButtons.wrap.wrap")
      }
    >
      <div
        className="tw-cursor-pointer tw-text-muted-foreground tw-transition-colors hover:tw-text-foreground"
        onClick={() => setIsWrapped(!isWrapped)}
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
