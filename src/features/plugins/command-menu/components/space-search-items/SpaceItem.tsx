import { useDebounce } from "@uidotdev/usehooks";
import { useCommandState } from "cmdk";
import { isHotkeyPressed } from "react-hotkeys-hook";
import { sendMessage } from "webext-bridge/content-script";

import AtomicSimple from "@/components/icons/AtomicSimple";
import KeyCombo from "@/components/KeyCombo";
import { CommandItem } from "@/components/ui/command";
import { languageModels } from "@/data/plugins/query-box/language-model-selector/language-models";
import { AdditionalInfos } from "@/features/plugins/command-menu/components/space-search-items/AdditionalInfos";
import { useCommandMenuStore } from "@/features/plugins/command-menu/store";
import { Space } from "@/services/pplx-api/pplx-api.types";
import { emojiCodeToString } from "@/utils/utils";

type SpaceItemProps = {
  space: Space;
};

export function SpaceItem({ space }: SpaceItemProps) {
  const {
    setOpen,
    setFilter,
    setSearchValue,
    setSpacethreadFilterSlug,
    setSpacethreadTitle,
  } = useCommandMenuStore();

  const isHighlighted: boolean = useCommandState(
    (state) => state.value === space.uuid,
  );

  const searchKeyword = useMemo(() => {
    return (space.title + space.description + space.instructions)
      .replace(/\s+/g, "")
      .toLowerCase();
  }, [space]);

  const modelSelection = useMemo(() => {
    return languageModels.find((model) => model.code === space.model_selection);
  }, [space]);

  return (
    <CommandItem
      key={space.uuid}
      asChild
      value={space.uuid}
      keywords={[searchKeyword]}
      className={cn(
        "tw-flex tw-min-h-10 tw-items-center",
        isHighlighted && "tw-h-max",
      )}
      onSelect={() => {
        if (isHotkeyPressed("ctrl"))
          return window.open(`/collections/${space.slug}`, "_blank");
        else if (isHotkeyPressed("shift")) {
          setFilter("spaces-threads");
          setSearchValue("");
          setSpacethreadFilterSlug(space.slug);
          setSpacethreadTitle(space.title);
        } else {
          sendMessage(
            "spa-router:push",
            {
              url: `/collections/${space.slug}`,
            },
            "window",
          );

          setOpen(false);
        }
      }}
    >
      <a
        href={`/collections/${space.slug}`}
        className="tw-flex tw-h-full tw-w-full tw-flex-col tw-gap-2"
      >
        <div className="tw-flex tw-w-full tw-items-center tw-justify-between">
          <div className="tw-flex tw-flex-1 tw-items-center tw-gap-2">
            {space.emoji && <div>{emojiCodeToString(space.emoji)}</div>}
            <div className="tw-line-clamp-1">{space.title.slice(0, 100)}</div>
          </div>
          <div className="tw-flex tw-flex-shrink-0 tw-items-center tw-gap-1">
            {modelSelection && (
              <div
                className={
                  "tw-flex tw-flex-shrink-0 tw-items-center tw-gap-1 tw-rounded-md tw-border tw-border-border/50 tw-bg-secondary tw-px-2 tw-py-1 tw-text-xs tw-text-muted-foreground"
                }
              >
                <AtomicSimple className="!tw-size-3" />
                <span>
                  {
                    languageModels.find(
                      (model) => model.code === space.model_selection,
                    )?.label
                  }
                </span>
              </div>
            )}
            {useDebounce(isHighlighted, 300) && (
              <AdditionalInfos space={space} />
            )}
          </div>
        </div>
        {isHighlighted && (space.description || space.instructions) && (
          <div className="tw-flex tw-flex-col tw-gap-1 tw-rounded-md tw-border tw-border-border/50 tw-bg-background tw-p-2">
            {space.description && (
              <div className="tw-flex tw-items-baseline tw-gap-1">
                <div className="tw-text-xs tw-font-medium">
                  {t(
                    "plugin-command-menu:commandMenu.spaceSearch.spaceItem.details.description",
                  )}
                </div>
                <div className="tw-line-clamp-2 tw-text-xs tw-text-foreground">
                  {space.description}
                </div>
              </div>
            )}
            {space.instructions && (
              <div className="tw-flex tw-items-baseline tw-gap-1">
                <div className="tw-text-xs tw-font-medium">
                  {t(
                    "plugin-command-menu:commandMenu.spaceSearch.spaceItem.details.instructions",
                  )}
                </div>
                <div className="tw-line-clamp-2 tw-text-xs tw-text-foreground">
                  {space.instructions}
                </div>
              </div>
            )}
          </div>
        )}
        {isHighlighted && (
          <div className="tw-flex tw-items-center tw-justify-end tw-gap-2 tw-text-xs tw-text-muted-foreground">
            <KeyCombo keys={["shift", "enter"]} />
            <span>
              {t(
                "plugin-command-menu:commandMenu.spaceSearch.spaceItem.searchHint",
              )}
            </span>
          </div>
        )}
      </a>
    </CommandItem>
  );
}
