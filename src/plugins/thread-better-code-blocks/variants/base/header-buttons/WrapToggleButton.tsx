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
        className="x-cursor-pointer x-text-muted-foreground x-transition-colors hover:x-text-foreground"
        onClick={() => setIsWrapped(!isWrapped)}
      >
        {isWrapped ? (
          <LuAlignJustify className="x-size-4" />
        ) : (
          <LuWrapText className="x-size-4" />
        )}
      </div>
    </Tooltip>
  );
}
