import { PopoverOpenChangeDetails } from "@ark-ui/react";
import { useState } from "react";
import { LuMinus, LuPlus } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { Command, CommandList, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PLUGIN_TAGS, type PluginTagValues } from "@/data/plugins/plugins-data";
import { usePluginContext } from "@/features/options-page/dashboard/pages/plugins/PluginContext";

export function TagsFilter() {
  const [filters, setFilters] = usePluginContext();
  const [open, setOpen] = useState(false);

  const handleSelect = (tag: PluginTagValues) => {
    const currentTags = filters.tags;
    const currentExcludeTags = filters.excludeTags;

    // Cycle through states
    if (!currentTags.includes(tag) && !currentExcludeTags.includes(tag)) {
      setFilters({
        ...filters,
        tags: [...currentTags, tag],
      });
    } else if (currentTags.includes(tag)) {
      setFilters({
        ...filters,
        tags: currentTags.filter((t) => t !== tag),
        excludeTags: [...currentExcludeTags, tag],
      });
    } else {
      setFilters({
        ...filters,
        excludeTags: currentExcludeTags.filter((t) => t !== tag),
      });
    }
  };

  const handleOpenChange = (details: PopoverOpenChangeDetails) => {
    setOpen(details.open);
  };

  const getTagState = (
    tag: PluginTagValues,
  ): "include" | "exclude" | "none" => {
    if (filters.tags.includes(tag)) return "include";
    if (filters.excludeTags.includes(tag)) return "exclude";
    return "none";
  };

  const getActiveFiltersCount = () =>
    filters.tags.length + filters.excludeTags.length;

  return (
    <div className="tw-flex tw-flex-col tw-gap-2">
      <Popover
        open={open}
        positioning={{
          placement: "bottom-end",
        }}
        onOpenChange={handleOpenChange}
      >
        <PopoverTrigger asChild>
          <Button variant="ghost" className="tw-py-2">
            <div className="tw-flex tw-items-center tw-gap-2">
              <span>Tags</span>
              {getActiveFiltersCount() > 0 && (
                <div className="tw-flex tw-h-4 tw-w-4 tw-items-center tw-justify-center tw-rounded-full tw-bg-primary/10 tw-text-[10px] tw-font-medium tw-text-primary">
                  {getActiveFiltersCount()}
                </div>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="tw-w-[230px] tw-p-0">
          <Command>
            <CommandList className="tw-p-3 tw-shadow-lg [&_[cmdk-list-sizer]]:tw-flex [&_[cmdk-list-sizer]]:tw-flex-row [&_[cmdk-list-sizer]]:tw-flex-wrap">
              {Object.entries(PLUGIN_TAGS).map(
                ([key, { label, description }]) => {
                  const tagState = getTagState(key as PluginTagValues);
                  return (
                    <Tooltip key={key} content={description}>
                      <CommandItem
                        className={cn({
                          "tw-m-1 tw-w-max tw-cursor-pointer tw-rounded-md tw-px-2 tw-py-0.5 tw-text-sm tw-transition-colors hover:tw-bg-primary/10 aria-selected:tw-bg-secondary aria-selected:tw-text-muted-foreground":
                            true,
                          "tw-bg-primary tw-text-primary-foreground aria-selected:tw-bg-primary aria-selected:tw-text-primary-foreground":
                            tagState === "include",
                          "tw-bg-destructive tw-text-destructive-foreground aria-selected:tw-bg-destructive aria-selected:tw-text-destructive-foreground":
                            tagState === "exclude",
                          "tw-bg-secondary": tagState === "none",
                        })}
                        onSelect={() => handleSelect(key as PluginTagValues)}
                      >
                        {tagState === "include" ? (
                          <span className="tw-flex tw-items-center tw-gap-1">
                            <LuPlus className="tw-h-3 tw-w-3" />
                            {label}
                          </span>
                        ) : tagState === "exclude" ? (
                          <span className="tw-flex tw-items-center tw-gap-1">
                            <LuMinus className="tw-h-3 tw-w-3" />
                            {label}
                          </span>
                        ) : (
                          label
                        )}
                      </CommandItem>
                    </Tooltip>
                  );
                },
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
