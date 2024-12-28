import { useQuery } from "@tanstack/react-query";
import { LuLoaderCircle } from "react-icons/lu";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import SpaceItem from "@/features/plugins/query-box/space-navigator/SpaceItem";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import UiUtils from "@/utils/UiUtils";

export default function SpaceNavigatorContent() {
  const { data: spaces, isLoading } = useQuery(pplxApiQueries.spaces);

  return (
    <Command
      filter={(value, search, keywords) => {
        const extendValue =
          value + (keywords?.join("") ?? "").replace(/\s+/g, "").toLowerCase();

        const normalizedSearch = search.replace(/\s+/g, "").toLowerCase();

        if (extendValue.includes(normalizedSearch)) return 1;
        return 0;
      }}
      onKeyDown={(event) => {
        if (event.key === Key.Escape) {
          event.preventDefault();
          event.stopPropagation();

          setTimeout(() => {
            UiUtils.getActiveQueryBoxTextarea().trigger("focus");
          }, 100);
        }
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
            <LuLoaderCircle className="tw-inline-block tw-size-4 tw-animate-spin" />
            <span>{t("plugin-space-navigator:spaceNavigator.loading")}</span>
          </div>
        ) : (
          <CommandGroup>
            {spaces?.map((space) => (
              <SpaceItem key={space.uuid} space={space} />
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
}
