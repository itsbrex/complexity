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
        <div className="x-flex x-items-center x-gap-2">
          <LuLoaderCircle className="x-size-4 x-animate-spin" />
          {!isMobile && (
            <span>{t("plugin-export-thread:exportButton.action")}</span>
          )}
        </div>
      ) : (
        <div className="x-flex x-items-center x-gap-2">
          <LuDownload className="x-size-4" />
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
              <div className="x-flex x-items-center x-gap-2">
                <LuCheck className="x-size-4" />
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
          className="x-box-content x-h-8 x-px-2"
        >
          {isFetching ? defaultIdleText : (copyConfirmText ?? defaultIdleText)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="x-font-medium">
        <DropdownMenuItem value="default">
          <BiLogoMarkdown className="x-mr-2 x-size-4" />
          <span>{t("plugin-export-thread:exportButton.options.default")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem value="without-citations">
          <LuLink2Off className="x-mr-2 x-size-4" />
          <span>
            {t("plugin-export-thread:exportButton.options.withoutCitations")}
          </span>
        </DropdownMenuItem>
        <DropdownMenuSub
          onSelect={({ value }) => {
            handleDownload(value === "default");
          }}
        >
          <DropdownMenuSubTrigger className="x-p-2">
            <LuFile className="x-mr-2 x-size-4" />
            <span>
              {t("plugin-export-thread:exportButton.options.download")}
            </span>
          </DropdownMenuSubTrigger>
          <DropdownMenuContent className="x-font-medium">
            <DropdownMenuItem value="default">
              <BiLogoMarkdown className="x-mr-2 x-size-4" />
              <span>
                {t("plugin-export-thread:exportButton.options.default")}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem value="without-citations">
              <LuLink2Off className="x-mr-2 x-size-4" />
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
