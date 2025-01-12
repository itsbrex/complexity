import { LuChevronDown } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";

export default function SidebarPinnedSpacesVisToggle() {
  return (
    <Tooltip content="Expand pinned Spaces">
      <div
        className="tw-invisible tw-flex tw-size-6 tw-items-center tw-justify-center tw-text-muted-foreground tw-opacity-0 tw-transition-all hover:tw-bg-white/5 hover:tw-text-foreground group-hover:tw-visible group-hover:tw-opacity-100"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <LuChevronDown />
      </div>
    </Tooltip>
  );
}
