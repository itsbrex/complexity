import { sendMessage } from "webext-bridge/content-script";

import { useSpaRouter } from "@/features/plugins/_core/spa-router/listeners";
import BaseMenuItem, {
  BaseCommandMenuItem,
} from "@/features/plugins/command-menu/components/BaseItem";
import { useCommandMenuStore } from "@/features/plugins/command-menu/store";
import type { NavigationItem as NavigationItemType } from "@/features/plugins/command-menu/types";
import { whereAmI } from "@/utils/utils";

type NavigationItemProps = BaseCommandMenuItem & NavigationItemType;

const NavigationItem = memo((props: NavigationItemProps) => {
  const { url } = useSpaRouter();

  const searchValue = useCommandMenuStore((state) => state.searchValue);

  const shouldShow = whereAmI(url) !== props.whereAmI || searchValue.length > 0;

  const defaultOnSelect = useCallback(() => {
    if (!props.path) return;

    sendMessage(
      "spa-router:push",
      {
        url: props.path,
      },
      "window",
    );
  }, [props.path]);

  if (!shouldShow) return null;

  const {
    path,
    whereAmI: _,
    external,
    onSelect,
    ...baseMenuItemInheritedProps
  } = props;

  return (
    <BaseMenuItem
      {...baseMenuItemInheritedProps}
      onSelect={onSelect || defaultOnSelect}
    />
  );
});

export default NavigationItem;
