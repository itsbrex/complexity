import { useDebounce, useLocalStorage } from "@uidotdev/usehooks";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";

export default function SidebarToggleableRecentThreadsToggleButton() {
  const isMobile = useDebounce(
    useIsMobileStore((state) => state.isMobile),
    1000,
  );

  const [isCollapsed, setIsCollapsed] = useLocalStorage(
    "cplx.sidebar-recent-threads-collapsed",
    false,
  );

  useEffect(() => {
    $(".group\\/history").toggleClass("x-hidden", isCollapsed);
  }, [isCollapsed, isMobile]);

  return (
    <Tooltip content={isCollapsed ? t("misc.expand") : t("misc.collapse")}>
      <div
        className="x-invisible x-flex x-size-6 x-items-center x-justify-center x-text-foreground x-opacity-0 x-transition-all hover:x-bg-black/5 group-hover:x-visible group-hover:x-opacity-100 dark:hover:x-bg-white/5"
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
