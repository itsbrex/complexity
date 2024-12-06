import { useQuery } from "@tanstack/react-query";
import { LuLoader2 } from "react-icons/lu";

import PplxSpace from "@/components/icons/PplxSpace";
import Tooltip from "@/components/Tooltip";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSpaRouter } from "@/features/plugins/_core/spa-router/listeners";
import SpaceItem from "@/features/plugins/query-box/space-navigator/SpaceItem";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import { parseUrl } from "@/utils/utils";

export default function SpaceNavigator() {
  const [open, setOpen] = useState(false);

  const {
    data: spaces,
    isFetching,
    isLoading,
  } = useQuery(pplxApiQueries.spaces);

  const url = useSpaRouter((state) => state.url);

  const spaceSlugFromUrl = parseUrl(url).pathname.split("/").pop();

  const spaceNameFromUrl = spaces?.find(
    (space) =>
      space.slug === spaceSlugFromUrl || space.uuid === spaceSlugFromUrl,
  )?.title;

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
      <Tooltip content="Search & Navigate to Space">
        <PopoverTrigger asChild>
          <button className="tw-flex tw-min-h-8 tw-w-max tw-cursor-pointer tw-items-center tw-justify-between tw-gap-1 tw-rounded-md tw-px-2 tw-text-center tw-text-sm tw-font-medium tw-text-muted-foreground tw-outline-none tw-transition-all tw-duration-150 placeholder:tw-text-muted-foreground hover:tw-bg-primary-foreground hover:tw-text-foreground focus-visible:tw-bg-primary-foreground focus-visible:tw-outline-none active:tw-scale-95 disabled:tw-cursor-not-allowed disabled:tw-opacity-50 [&>span]:!tw-truncate">
            <PplxSpace className="tw-size-4" />
            <span>{spaceNameFromUrl ?? "Spaces"}</span>
          </button>
        </PopoverTrigger>
      </Tooltip>
      <PopoverContent className="tw-p-0">
        <Command
          filter={(value, search, keywords) => {
            const extendValue =
              value +
              (keywords?.join("") ?? "").replace(/\s+/g, "").toLowerCase();

            const normalizedSearch = search.replace(/\s+/g, "").toLowerCase();

            if (extendValue.includes(normalizedSearch)) return 1;
            return 0;
          }}
        >
          <CommandInput placeholder="Search..." searchIcon={false} />
          {!isLoading && <CommandEmpty>No results found.</CommandEmpty>}
          <CommandList>
            {isLoading ? (
              <div className="tw-my-10 tw-w-full tw-space-x-2 tw-text-center">
                <LuLoader2 className="tw-inline-block tw-size-4 tw-animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              <CommandGroup className={cn({ "tw-opacity-50": isFetching })}>
                {spaces?.map((space) => (
                  <SpaceItem key={space.uuid} space={space} />
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
