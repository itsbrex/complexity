import { PopoverRootProps } from "@ark-ui/react";
import { LuSearch } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SpaceNavigatorContent from "@/plugins/space-navigator/SpaceNavigatorContent";

type SpaceNavigator = PopoverRootProps;

export default function SpaceNavigator({ ...props }: SpaceNavigator) {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      lazyMount={false}
      unmountOnExit={false}
      positioning={{
        placement: "right-start",
        gutter: 20,
      }}
      open={open}
      onOpenChange={({ open }) => setOpen(open)}
      {...props}
    >
      <Tooltip
        content={t("plugin-space-navigator:spaceNavigator.button.label")}
      >
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <PopoverTrigger asChild>
            <div className="tw-flex tw-size-6 tw-items-center tw-justify-center tw-text-muted-foreground tw-transition-all hover:tw-bg-black/5 hover:tw-text-foreground dark:hover:tw-bg-white/5">
              <LuSearch />
            </div>
          </PopoverTrigger>
        </div>
      </Tooltip>
      <PopoverContent className="tw-p-0">
        <SpaceNavigatorContent setOpen={setOpen} />
      </PopoverContent>
    </Popover>
  );
}
