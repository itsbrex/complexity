import { LuChevronDown, LuChevronUp } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { useGlobalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";

export default function CollapsibleQueryToggleButton({
  messageIndex,
}: {
  messageIndex: number;
}) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const messageBlock = useGlobalDomObserverStore(
    (state) => state.threadComponents.messageBlocks?.[messageIndex],
  );

  const $queryElement = messageBlock?.$query;

  useEffect(() => {
    $queryElement?.attr(
      "data-cplx-query-collapsed",
      isCollapsed ? "true" : "false",
    );
  }, [$queryElement, isCollapsed]);

  if (!$queryElement) return null;

  const isOverflowing =
    $queryElement.attr("original-height") != null &&
    Number($queryElement.attr("original-height")) > 300;

  if (!isOverflowing) return null;

  return (
    <>
      <div className="mx-2xs h-4 border-l border-borderMain/50 ring-borderMain/50 divide-borderMain/50 dark:divide-borderMainDark/50 dark:ring-borderMainDark/50 dark:border-borderMainDark/50 bg-transparent" />
      <Tooltip
        content={
          isCollapsed ? t("common:misc.expand") : t("common:misc.collapse")
        }
      >
        <div
          role="button"
          className="tw-cursor-pointer tw-rounded-md tw-bg-primary tw-p-1 tw-text-primary-foreground tw-transition-all hover:tw-opacity-80 active:tw-scale-95"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <LuChevronDown /> : <LuChevronUp />}
        </div>
      </Tooltip>
    </>
  );
}
