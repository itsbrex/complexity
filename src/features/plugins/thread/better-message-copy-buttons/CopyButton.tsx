import { BiLogoMarkdown } from "react-icons/bi";
import { LuCheck, LuCopy, LuLink2Off, LuLoader2 } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCopyMessage } from "@/features/plugins/thread/useCopyMessage";
import useToggleButtonText from "@/hooks/useToggleButtonText";

type BetterCopyButtonProps = {
  messageBlockIndex: number;
  hasSources: boolean;
};

type CopyOptions = "default" | "without-citations";

const BetterCopyButton = memo(function BetterCopyButton({
  messageBlockIndex,
  hasSources,
}: BetterCopyButtonProps) {
  const [triggerIcon, setTriggerIcon] = useToggleButtonText({
    defaultText: <LuCopy className="tw-size-4" />,
  });

  const { copyMessage, isFetching } = useCopyMessage();

  const handleCopy = useCallback(
    async (withCitations: boolean) => {
      if (isFetching) return;

      await copyMessage({
        messageBlockIndex,
        withCitations,
        onComplete: () => setTriggerIcon(<LuCheck className="tw-size-4" />),
      });
    },
    [copyMessage, isFetching, messageBlockIndex, setTriggerIcon],
  );

  return (
    <DropdownMenu
      lazyMount
      unmountOnExit
      positioning={{ placement: "bottom-end" }}
      onSelect={({ value }) => {
        handleCopy((value as CopyOptions) === "default");
      }}
    >
      <Tooltip content={t("plugin-better-copy-buttons:copyButton.tooltip")}>
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
            value={"default" satisfies CopyOptions}
            className="tw-flex tw-items-center tw-gap-2"
          >
            <BiLogoMarkdown className="tw-size-4" />
            <span>
              {t("plugin-better-copy-buttons:copyButton.options.default")}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            value={"without-citations" satisfies CopyOptions}
            className="tw-flex tw-items-center tw-gap-2"
          >
            <LuLink2Off className="tw-size-4" />
            <span>
              {t(
                "plugin-better-copy-buttons:copyButton.options.withoutCitations",
              )}
            </span>
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
