import { PopoverOpenChangeDetails } from "@ark-ui/react";
import { useState } from "react";
import { LuX } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  PLUGIN_TAGS,
  type PluginTagValues,
} from "@/data/consts/plugins/plugins-data";
import { usePluginContext } from "@/features/options-page/dashboard/pages/plugins/PluginContext";

export function TagsFilter() {
  const [filters, setFilters] = usePluginContext();
  const [open, setOpen] = useState(false);

  const handleSelect = (tag: PluginTagValues) => {
    const currentTags = filters.tags;
    if (!currentTags.includes(tag)) {
      setFilters({ ...filters, tags: [...currentTags, tag] });
    } else {
      setFilters({
        ...filters,
        tags: currentTags.filter((t) => t !== tag),
      });
    }
  };

  const handleOpenChange = (details: PopoverOpenChangeDetails) => {
    setOpen(details.open);
  };

  return (
    <div className="tw-flex tw-flex-col tw-gap-2">
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="tw-py-2">
            <div className="tw-flex tw-items-center tw-gap-2">
              <span>Tags</span>
              {filters.tags?.length > 0 && (
                <div className="tw-flex tw-h-4 tw-w-4 tw-items-center tw-justify-center tw-rounded-full tw-bg-primary/10 tw-text-[10px] tw-font-medium tw-text-primary">
                  {filters.tags.length}
                </div>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="tw-w-[230px] tw-p-0">
          <Command>
            {/* <CommandInput placeholder="Search tags..." />
            <CommandEmpty>No results found.</CommandEmpty> */}
            <CommandList className="tw-p-3 tw-shadow-lg [&_[cmdk-list-sizer]]:tw-flex [&_[cmdk-list-sizer]]:tw-flex-row [&_[cmdk-list-sizer]]:tw-flex-wrap">
              {Object.entries(PLUGIN_TAGS).map(([key, { label }]) => {
                const isSelected = filters.tags?.includes(
                  key as PluginTagValues,
                );
                return (
                  <CommandItem
                    key={key}
                    className={cn({
                      "tw-m-1 tw-w-max tw-cursor-pointer tw-rounded-md tw-bg-secondary tw-px-2 tw-py-0.5 tw-text-sm tw-transition-colors hover:tw-bg-primary/10 aria-selected:tw-bg-secondary aria-selected:tw-text-muted-foreground":
                        true,
                      "tw-bg-primary tw-text-primary-foreground aria-selected:tw-bg-primary aria-selected:tw-text-primary-foreground":
                        isSelected,
                      "tw-bg-secondary": !isSelected,
                    })}
                    onSelect={() => handleSelect(key as PluginTagValues)}
                  >
                    {isSelected ? (
                      <span className="tw-flex tw-items-center tw-gap-1">
                        {label}
                        <LuX className="tw-h-3 tw-w-3" />
                      </span>
                    ) : (
                      label
                    )}
                  </CommandItem>
                );
              })}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
