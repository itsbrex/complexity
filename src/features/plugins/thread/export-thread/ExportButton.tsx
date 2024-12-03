import { BiLogoMarkdown } from "react-icons/bi";
import { LuCheck, LuDownload, LuLink2Off, LuLoader2 } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCopyMessage } from "@/features/plugins/thread/useCopyMessage";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import useToggleButtonText from "@/hooks/useToggleButtonText";

const ExportButton = memo(function ExportButton() {
  const { isMobile } = useIsMobileStore();

  const { copyThread, isFetching } = useCopyMessage();

  const defaultIdleText = useMemo(
    () =>
      isFetching ? (
        <div className="tw-flex tw-items-center tw-gap-2">
          <LuLoader2 className="tw-size-4 tw-animate-spin" />
          {!isMobile && (
            <span>{t("plugin-export-thread:exportButton.action")}</span>
          )}
        </div>
      ) : (
        <div className="tw-flex tw-items-center tw-gap-2">
          <LuDownload className="tw-size-4" />
          {!isMobile && (
            <span>{t("plugin-export-thread:exportButton.action")}</span>
          )}
        </div>
      ),
    [isFetching, isMobile],
  );

  const [copyConfirmText, setCopyConfirmText] = useToggleButtonText({
    defaultText: null,
  });

  return (
    <DropdownMenu
      positioning={{ placement: "bottom-end" }}
      onSelect={({ value }) => {
        copyThread({
          withCitations: value !== "without-citations",
          onComplete: () =>
            setCopyConfirmText(
              <div className="tw-flex tw-items-center tw-gap-2">
                <LuCheck className="tw-size-4" />
                {!isMobile && (
                  <span>{t("plugin-export-thread:exportButton.copied")}</span>
                )}
              </div>,
            ),
        });
      }}
    >
      <DropdownMenuTrigger asChild disabled={isFetching}>
        <Button
          variant={isMobile ? "default" : "outline"}
          size="sm"
          className="tw-h-8 tw-px-2"
        >
          {isFetching ? defaultIdleText : (copyConfirmText ?? defaultIdleText)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem value="default">
          <BiLogoMarkdown className="tw-mr-2 tw-size-4" />
          <span>{t("plugin-export-thread:exportButton.options.default")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem value="without-citations">
          <LuLink2Off className="tw-mr-2 tw-size-4" />
          <span>
            {t("plugin-export-thread:exportButton.options.withoutCitations")}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export default ExportButton;
