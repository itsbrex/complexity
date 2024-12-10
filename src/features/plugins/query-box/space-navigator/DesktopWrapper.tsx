import PplxSpace from "@/components/icons/PplxSpace";
import Tooltip from "@/components/Tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SpaceNavigatorContent from "@/features/plugins/query-box/space-navigator/SpaceNavigatorContent";
import { type Space } from "@/services/pplx-api/pplx-api.types";

type SpaceNavigatorDesktopWrapperProps = {
  spaces?: Space[];
  isLoading: boolean;
  isFetching: boolean;
  spaceNameFromUrl?: string;
};

export default function SpaceNavigatorDesktopWrapper({
  spaces,
  isLoading,
  isFetching,
  spaceNameFromUrl,
}: SpaceNavigatorDesktopWrapperProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      lazyMount
      closeOnEscape
      closeOnInteractOutside
      portal={false}
      positioning={{
        placement: "bottom-start",
      }}
      open={open}
      onOpenChange={({ open }) => setOpen(open)}
    >
      <Tooltip
        content={t("plugin-space-navigator:spaceNavigator.button.label")}
      >
        <PopoverTrigger asChild>
          <button className="tw-flex tw-min-h-8 tw-w-max tw-cursor-pointer tw-items-center tw-justify-between tw-gap-1 tw-rounded-md tw-px-2 tw-text-center tw-text-sm tw-font-medium tw-text-muted-foreground tw-outline-none tw-transition-all tw-duration-150 placeholder:tw-text-muted-foreground hover:tw-bg-primary-foreground hover:tw-text-foreground focus-visible:tw-bg-primary-foreground focus-visible:tw-outline-none active:tw-scale-95 disabled:tw-cursor-not-allowed disabled:tw-opacity-50 [&>span]:!tw-truncate">
            <PplxSpace className="tw-size-4" />
            <span>
              {spaceNameFromUrl ??
                t("plugin-space-navigator:spaceNavigator.button.defaultText")}
            </span>
          </button>
        </PopoverTrigger>
      </Tooltip>
      <PopoverContent className="tw-p-0">
        <SpaceNavigatorContent
          spaces={spaces}
          isLoading={isLoading}
          isFetching={isFetching}
        />
      </PopoverContent>
    </Popover>
  );
}
