import BaseMenuItem, {
  BaseCommandMenuItem,
} from "@/features/plugins/command-menu/components/BaseItem";
import { useColorScheme } from "@/features/plugins/command-menu/hooks/useColorScheme";
import { useCommandMenuStore } from "@/features/plugins/command-menu/store";
import type { ColorSchemeItem as ColorSchemeItemType } from "@/features/plugins/command-menu/types";

type ColorSchemeItemProps = BaseCommandMenuItem & ColorSchemeItemType;

const ColorSchemeItem = memo((props: ColorSchemeItemProps) => {
  const searchValue = useCommandMenuStore((state) => state.searchValue);

  const { handleColorSchemeChange } = useColorScheme();

  const shouldShow =
    $("html").attr("data-color-scheme") !== props.scheme ||
    searchValue.length > 0;

  if (!shouldShow) return null;

  const { scheme, onSelect, ...baseMenuItemInheritedProps } = props;

  return (
    <BaseMenuItem
      {...baseMenuItemInheritedProps}
      onSelect={onSelect || (() => handleColorSchemeChange(scheme))}
    />
  );
});

export default ColorSchemeItem;
