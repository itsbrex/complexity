import type { ZenModeItem as ZenModeItemType } from "@/data/plugins/command-menu/types";
import BaseMenuItem, {
  BaseCommandMenuItem,
} from "@/plugins/command-menu/components/BaseItem";

type ZenModeItemProps = BaseCommandMenuItem & ZenModeItemType;

const ZenModeItem = memo((props: ZenModeItemProps) => {
  const { action, onSelect, ...baseMenuItemInheritedProps } = props;

  const isZenModeEnabled = $("body").attr("data-cplx-zen-mode") === "true";
  const isEnableItem = props.type === "enable";

  const shouldShow = isZenModeEnabled !== isEnableItem;

  if (!shouldShow) return null;

  return (
    <BaseMenuItem
      {...baseMenuItemInheritedProps}
      onSelect={onSelect || action}
    />
  );
});

export default ZenModeItem;
