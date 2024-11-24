import { useQuery } from "@tanstack/react-query";
import { BiLogoMarkdown } from "react-icons/bi";
import { LuCheck, LuCopy, LuLink2Off, LuLoader2 } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCopyMessage } from "@/features/plugins/thread/better-message-copy-buttons/useCopyMessage";
import useToggleButtonText from "@/hooks/useToggleButtonText";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import { parseUrl } from "@/utils/utils";

type BetterCopyButtonProps = {
  messageBlockIndex: number;
  hasSources: boolean;
};

const BetterCopyButton = memo(function BetterCopyButton({
  messageBlockIndex,
  hasSources,
}: BetterCopyButtonProps) {
  const [triggerIcon, setTriggerIcon] = useToggleButtonText({
    defaultText: <LuCopy className="tw-size-4" />,
  });

  const copyMessage = useCopyMessage();

  const threadSlug = parseUrl().pathname.split("/").pop() || "";
  const { isFetching, refetch } = useQuery({
    ...pplxApiQueries.threadInfo(threadSlug),
    enabled: false,
  });

  const handleCopy = useCallback(
    async (withCitations: boolean) => {
      if (isFetching) return;

      await copyMessage({
        messageBlockIndex,
        withCitations,
        onComplete: () => setTriggerIcon(<LuCheck className="tw-size-4" />),
        fetchFn: async () => (await refetch()).data,
      });
    },
    [copyMessage, isFetching, messageBlockIndex, refetch, setTriggerIcon],
  );

  return (
    <DropdownMenu
      lazyMount
      unmountOnExit
      positioning={{ placement: "bottom-end" }}
      onSelect={({ value }) => {
        handleCopy(value === "copy");
      }}
    >
      <Tooltip content="Copy">
        <DropdownMenuTrigger asChild>
          <CopyButtonTrigger
            isFetching={isFetching}
            icon={triggerIcon}
            onClick={() => !hasSources && handleCopy(true)}
          />
        </DropdownMenuTrigger>
      </Tooltip>
      {hasSources && (
        <DropdownMenuContent>
          <DropdownMenuItem
            value="copy"
            className="tw-flex tw-items-center tw-gap-2"
          >
            <BiLogoMarkdown className="tw-size-4" />
            <span>Default</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            value="copy-without-citations"
            className="tw-flex tw-items-center tw-gap-2"
          >
            <LuLink2Off className="tw-size-4" />
            <span>Without citations</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
});

type CopyButtonTriggerProps = {
  isFetching: boolean;
  icon: React.ReactNode;
  onClick?: () => void;
};

const CopyButtonTrigger = memo(
  forwardRef<HTMLDivElement, CopyButtonTriggerProps & { asChild?: boolean }>(
    function CopyButtonTrigger({ isFetching, icon, onClick, ...props }, ref) {
      return (
        <div
          {...props}
          ref={ref}
          tabIndex={0}
          className={cn(
            "tw-cursor-pointer tw-rounded-md tw-p-2 tw-text-muted-foreground tw-transition-all hover:tw-bg-secondary hover:tw-text-foreground active:tw-scale-95",
            {
              "tw-cursor-not-allowed tw-opacity-50": isFetching,
            },
          )}
          onClick={onClick}
        >
          {isFetching ? (
            <LuLoader2 className="tw-size-4 tw-animate-spin" />
          ) : (
            icon
          )}
        </div>
      );
    },
  ),
);

export default BetterCopyButton;
