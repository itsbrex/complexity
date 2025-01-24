import { BiLogoMarkdown } from "react-icons/bi";
import {
  LuCheck,
  LuDownload,
  LuFile,
  LuLink2Off,
  LuLoaderCircle,
} from "react-icons/lu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { useCopyPplxThread } from "@/hooks/useCopyPplxThread";
import useToggleButtonText from "@/hooks/useToggleButtonText";
import { parseUrl } from "@/utils/utils";

const ExportButton = memo(function ExportButton() {
  const { isMobile } = useIsMobileStore();
  const { copyThread, isFetching, getContent } = useCopyPplxThread();

  const defaultIdleText = useMemo(
    () =>
      isFetching ? (
        <div className="tw-flex tw-items-center tw-gap-2">
          <LuLoaderCircle className="tw-size-4 tw-animate-spin" />
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

  const handleDownload = useCallback(
    async (withCitations: boolean) => {
      try {
        const slug =
          (parseUrl().pathname.split("/").pop() ||
            `thread-${new Date().getTime()}`) +
          (withCitations ? "" : " (no-citations)");
        const content = await getContent({ withCitations });
        const blob = new Blob([content], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${slug}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Failed to download:", error);
        toast({
          title: "❌ Failed to download",
          description:
            error instanceof Error ? error.message : "Unknown error occurred",
        });
      }
    },
    [getContent],
  );

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
      <DropdownMenuContent className="tw-font-medium">
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
        <DropdownMenuSub
          onSelect={({ value }) => {
            handleDownload(value === "default");
          }}
        >
          <DropdownMenuSubTrigger className="tw-p-2">
            <LuFile className="tw-mr-2 tw-size-4" />
            <span>
              {t("plugin-export-thread:exportButton.options.download")}
            </span>
          </DropdownMenuSubTrigger>
          <DropdownMenuContent className="tw-font-medium">
            <DropdownMenuItem value="default">
              <BiLogoMarkdown className="tw-mr-2 tw-size-4" />
              <span>
                {t("plugin-export-thread:exportButton.options.default")}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem value="without-citations">
              <LuLink2Off className="tw-mr-2 tw-size-4" />
              <span>
                {t(
                  "plugin-export-thread:exportButton.options.withoutCitations",
                )}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export default ExportButton;
