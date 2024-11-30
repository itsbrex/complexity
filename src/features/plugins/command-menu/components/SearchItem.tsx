import BaseMenuItem, {
  BaseCommandMenuItem,
} from "@/features/plugins/command-menu/components/BaseItem";
import { useCommandMenuStore } from "@/features/plugins/command-menu/store";
import type { SearchItem as SearchItemType } from "@/features/plugins/command-menu/types";

type SearchItemProps = BaseCommandMenuItem & SearchItemType;

export default function SearchItem(props: SearchItemProps) {
  const { filter, setFilter } = useCommandMenuStore();

  if (filter === props.code) return null;

  const { code, onSelect, ...baseMenuItemInheritedProps } = props;

  return (
    <BaseMenuItem
      {...baseMenuItemInheritedProps}
      closeOnSelect={false}
      onSelect={onSelect || (() => setFilter(props.code))}
    />
  );
}
