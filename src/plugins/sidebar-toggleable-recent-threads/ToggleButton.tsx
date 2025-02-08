import { useLocalStorage } from "@uidotdev/usehooks";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";

export default function SidebarToggleableRecentThreadsToggleButton() {
  const [isCollapsed, setIsCollapsed] = useLocalStorage(
    "cplx.sidebar-recent-threads-collapsed",
    false,
  );

  useEffect(() => {
    $(".group\\/history").toggleClass("x-hidden", isCollapsed);
  }, [isCollapsed]);

  return (
    <Tooltip content={isCollapsed ? t("misc.expand") : t("misc.collapse")}>
      <div
        className="x-invisible x-flex x-size-6 x-items-center x-justify-center x-text-muted-foreground x-opacity-0 x-transition-all hover:x-bg-black/5 hover:x-text-foreground group-hover:x-visible group-hover:x-opacity-100 dark:hover:x-bg-white/5"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsCollapsed((prev) => !prev);
        }}
      >
        {isCollapsed ? <LuChevronDown /> : <LuChevronUp />}
      </div>
    </Tooltip>
  );
}
