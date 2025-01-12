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
import SpaceItemPreview from "@/features/plugins/sidebar/space-navigator/SpaceItemPreview";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import UiUtils from "@/utils/UiUtils";

export default function SpaceNavigatorContent({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const { isMobile } = useIsMobileStore();

  const { data: spaces, isLoading } = useQuery(pplxApiQueries.spaces);

  const [searchValue, setSearchValue] = useState("");

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
        value={searchValue}
        className={cn({
          "tw-font-medium": !searchValue,
        })}
        searchIcon={false}
        onValueChange={(value) => setSearchValue(value)}
      />
      {!isLoading && (
        <CommandEmpty>
          {t("plugin-space-navigator:spaceNavigator.search.noResults")}
        </CommandEmpty>
      )}
      <div className="tw-flex tw-items-start tw-divide-x tw-divide-border/50">
        <CommandList className="tw-flex-1">
          {isLoading ? (
            <div className="tw-my-10 tw-w-full tw-space-x-2 tw-text-center">
              <LuLoaderCircle className="tw-inline-block tw-size-4 tw-animate-spin" />
              <span>{t("plugin-space-navigator:spaceNavigator.loading")}</span>
            </div>
          ) : (
            <CommandGroup>
              {spaces?.map((space) => (
                <SpaceItem key={space.uuid} space={space} setOpen={setOpen} />
              ))}
            </CommandGroup>
          )}
        </CommandList>
        {!isMobile && !isLoading && spaces && (
          <div className="custom-scrollbar tw-h-[300px] tw-overflow-auto sm:tw-w-[300px] lg:tw-w-[400px] xl:tw-w-[500px]">
            <SpaceItemPreview spaces={spaces} />
          </div>
        )}
      </div>
    </Command>
  );
}
