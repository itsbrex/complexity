import { useCommandState } from "cmdk";

import Tooltip from "@/components/Tooltip";
import { useCommandMenuStore } from "@/features/plugins/command-menu/store";
import { ThreadSearchApi } from "@/services/pplx-api/pplx-api.types";

export function SpacePreview({ thread }: { thread: ThreadSearchApi }) {
  const {
    setFilter,
    setSearchValue,
    setSpacethreadFilterSlug,
    setSpacethreadTitle,
    inputRef,
  } = useCommandMenuStore();

  const isHighlighted: boolean = useCommandState(
    (state) => state.value === thread.slug,
  );

  if (!thread.collection) return null;

  const handleChangeFilter = (
    e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
  ) => {
    e.stopPropagation();

    if (!thread.collection) return;

    setFilter("spaces-threads");
    setSearchValue("");
    setSpacethreadFilterSlug(thread.collection.slug);
    setSpacethreadTitle(thread.collection.title);

    setTimeout(() => {
      inputRef?.current?.focus();
    }, 100);
  };

  return (
    <Tooltip
      content={t(
        "plugin-command-menu:commandMenu.threadSearch.spacePreview.tooltip",
      )}
    >
      <div
        className="tw-rounded-md tw-border tw-border-border/50 tw-bg-secondary tw-px-2 tw-py-1 tw-text-xs tw-outline-none focus:tw-outline-2 focus:tw-outline-primary focus-visible:tw-outline-2 focus-visible:tw-outline-primary"
        title={thread.collection.title}
        tabIndex={isHighlighted ? 0 : -1}
        onClick={handleChangeFilter}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleChangeFilter(e);
          }
        }}
      >
        <div className="tw-max-w-[100px] tw-truncate">
          {thread.collection.title}
        </div>
      </div>
    </Tooltip>
  );
}
