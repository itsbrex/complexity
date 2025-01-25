import { BiLogoMarkdown } from "react-icons/bi";
import { LuCheck, LuCopy, LuLink2Off, LuLoaderCircle } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCopyPplxThread } from "@/hooks/useCopyPplxThread";
import useToggleButtonText from "@/hooks/useToggleButtonText";

type CopyButtonProps = {
  messageBlockIndex: number;
  hasSources: boolean;
};

type CopyOptions = "default" | "without-citations";

const CopyButton = memo(function CopyButton({
  messageBlockIndex,
  hasSources,
}: CopyButtonProps) {
  const [triggerIcon, setTriggerIcon] = useToggleButtonText({
    defaultText: <LuCopy />,
  });

  const { copyMessage, isFetching } = useCopyPplxThread();

  const handleCopy = useCallback(
    async (withCitations: boolean) => {
      if (isFetching) return;

      await copyMessage({
        messageBlockIndex,
        withCitations,
        onComplete: () => setTriggerIcon(<LuCheck />),
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
        <DropdownMenuContent className="x-font-medium">
          <DropdownMenuItem
            value={"default" satisfies CopyOptions}
            className="x-flex x-items-center x-gap-2"
          >
            <BiLogoMarkdown className="x-size-4" />
            <span>
              {t("plugin-better-copy-buttons:copyButton.options.default")}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            value={"without-citations" satisfies CopyOptions}
            className="x-flex x-items-center x-gap-2"
          >
            <LuLink2Off className="x-size-4" />
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
            "x-cursor-pointer x-rounded-md x-p-2 x-text-muted-foreground x-transition-all hover:x-bg-secondary hover:x-text-foreground active:x-scale-95",
            {
              "x-cursor-not-allowed x-opacity-50": isFetching,
            },
          )}
          onClick={onClick}
        >
          {isFetching ? (
            <LuLoaderCircle className="x-size-4 x-animate-spin" />
          ) : (
            icon
          )}
        </div>
      );
    },
  ),
);

export default CopyButton;
