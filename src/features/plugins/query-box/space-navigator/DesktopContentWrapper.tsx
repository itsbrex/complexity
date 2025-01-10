import Tooltip from "@/components/Tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SpaceNavigatorContent from "@/features/plugins/query-box/space-navigator/SpaceNavigatorContent";

type SpaceNavigatorDesktopWrapperProps = {
  children: React.ReactNode;
};

export default function SpaceNavigatorDesktopWrapper({
  children,
}: SpaceNavigatorDesktopWrapperProps) {
  return (
    <Popover
      lazyMount
      unmountOnExit
      closeOnEscape
      closeOnInteractOutside
      positioning={{
        placement: "bottom-start",
      }}
    >
      <Tooltip
        content={t("plugin-space-navigator:spaceNavigator.button.label")}
      >
        <PopoverTrigger asChild>{children}</PopoverTrigger>
      </Tooltip>
      <PopoverContent className="tw-p-0" portal={false}>
        <SpaceNavigatorContent />
      </PopoverContent>
    </Popover>
  );
}
