import { LuTrash } from "react-icons/lu";

import CopyButton from "@/components/CopyButton";
import { CommandItem } from "@/components/ui/command";
import { slashCommandMenuStore } from "@/features/plugins/query-box/slash-command-menu/store";
import { formatHowLongAgo } from "@/utils/dayjs";

type PromptHistoryItem = {
  id: string;
  prompt: string;
  createdAt: string;
  keywords: string[];
};

export default function PromptHistoryItem({
  item,
  isHighlighted,
  onDelete,
}: {
  item: PromptHistoryItem;
  isHighlighted: boolean;
  onDelete: (id: string) => void;
}) {
  const copyButtonRef = useRef<HTMLDivElement>(null);

  return (
    <CommandItem
      key={item.id}
      value={item.id}
      keywords={item.keywords}
      onSelect={() => {
        slashCommandMenuStore.getState().setIsOpen(false);
        slashCommandMenuStore
          .getState()
          .queryBoxAction.insertTextAtCaret(item.prompt);
      }}
      onKeyDown={(e) => {
        if (e.key === Key.Delete) {
          onDelete(item.id);
        } else if (e.ctrlKey && e.key === "c") {
          copyButtonRef.current?.click();
        }
      }}
    >
      <div className="tw-flex tw-w-full tw-items-start tw-justify-between tw-gap-4">
        <div className="">
          <div className="tw-line-clamp-3 tw-whitespace-pre-wrap">
            {item.prompt.trim()}
          </div>
        </div>
        <div className="tw-flex tw-flex-shrink-0 tw-items-center tw-gap-2 tw-text-xs tw-text-muted-foreground">
          {isHighlighted && (
            <>
              <CopyButton
                ref={copyButtonRef}
                content={item.prompt}
                iconProps={{ className: "tw-size-3" }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />
              <div
                className="tw-text-muted-foreground tw-transition-colors hover:tw-text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
              >
                <LuTrash />
              </div>
            </>
          )}
          <div>{formatHowLongAgo(item.createdAt)}</div>
        </div>
      </div>
    </CommandItem>
  );
}
