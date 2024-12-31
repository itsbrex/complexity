import { useColorSchemeStore } from "@/data/color-scheme-store";
import BaseMenuItem, {
  BaseCommandMenuItem,
} from "@/features/plugins/command-menu/components/BaseItem";
import { useCommandMenuStore } from "@/features/plugins/command-menu/store";
import type { ColorSchemeItem as ColorSchemeItemType } from "@/features/plugins/command-menu/types";

type ColorSchemeItemProps = BaseCommandMenuItem & ColorSchemeItemType;

const ColorSchemeItem = memo((props: ColorSchemeItemProps) => {
  const searchValue = useCommandMenuStore((state) => state.searchValue);

  const { colorScheme, setColorScheme } = useColorSchemeStore();

  const shouldShow = colorScheme !== props.scheme || searchValue.length > 0;

  if (!shouldShow) return null;

  const { scheme, onSelect, ...baseMenuItemInheritedProps } = props;

  return (
    <BaseMenuItem
      {...baseMenuItemInheritedProps}
      onSelect={onSelect || (() => setColorScheme(scheme))}
    />
  );
});

export default ColorSchemeItem;
