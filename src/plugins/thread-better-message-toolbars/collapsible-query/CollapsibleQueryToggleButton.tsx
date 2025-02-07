import { LuChevronDown, LuChevronUp } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { useThreadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";

export default function CollapsibleQueryToggleButton({
  messageIndex,
}: {
  messageIndex: number;
}) {
  const messageBlock = useThreadMessageBlocksDomObserverStore(
    (store) => store.messageBlocks?.[messageIndex],
    deepEqual,
  );

  const $queryElement = messageBlock?.nodes.$query;

  const [isCollapsed, setIsCollapsed] = useState(() => {
    const previousState = $queryElement?.attr("data-cplx-query-collapsed");
    return previousState === "true";
  });

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
          className="x-cursor-pointer x-rounded-md x-bg-primary x-p-1 x-text-primary-foreground x-transition-all hover:x-opacity-80 active:x-scale-95"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <LuChevronDown /> : <LuChevronUp />}
        </div>
      </Tooltip>
    </>
  );
}
