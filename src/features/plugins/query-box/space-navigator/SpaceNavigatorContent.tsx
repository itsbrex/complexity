import { LuLoader2 } from "react-icons/lu";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import SpaceItem from "@/features/plugins/query-box/space-navigator/SpaceItem";
import { type Space } from "@/services/pplx-api/pplx-api.types";

type SpaceNavigatorContentProps = {
  spaces?: Space[];
  isLoading: boolean;
  isFetching: boolean;
};

export default function SpaceNavigatorContent({
  spaces,
  isLoading,
  isFetching,
}: SpaceNavigatorContentProps) {
  return (
    <Command
      filter={(value, search, keywords) => {
        const extendValue =
          value + (keywords?.join("") ?? "").replace(/\s+/g, "").toLowerCase();

        const normalizedSearch = search.replace(/\s+/g, "").toLowerCase();

        if (extendValue.includes(normalizedSearch)) return 1;
        return 0;
      }}
    >
      <CommandInput
        placeholder={t(
          "plugin-space-navigator:spaceNavigator.search.placeholder",
        )}
        searchIcon={false}
      />
      {!isLoading && (
        <CommandEmpty>
          {t("plugin-space-navigator:spaceNavigator.search.noResults")}
        </CommandEmpty>
      )}
      <CommandList>
        {isLoading ? (
          <div className="tw-my-10 tw-w-full tw-space-x-2 tw-text-center">
            <LuLoader2 className="tw-inline-block tw-size-4 tw-animate-spin" />
            <span>{t("plugin-space-navigator:spaceNavigator.loading")}</span>
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
  );
}
