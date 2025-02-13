import { LuCheck, LuLoaderCircle } from "react-icons/lu";

import FaFileExport from "@/components/icons/FaFileExport";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { useCopyPplxThread } from "@/hooks/useCopyPplxThread";
import useToggleButtonText from "@/hooks/useToggleButtonText";
import { ExportOption } from "@/plugins/export-thread/export-options";
import { ExportActions } from "@/plugins/export-thread/ExportActions";
import { ExportFormatSelect } from "@/plugins/export-thread/ExportFormatSelect";
import { parseUrl } from "@/utils/utils";

const ExportButton = memo(function ExportButton() {
  const { isMobile } = useIsMobileStore();
  const { copyThread, isFetching, getContent } = useCopyPplxThread();
  const [open, setOpen] = useState(false);
  const [includeCitations, setIncludeCitations] = useState(true);
  const [format, setFormat] = useState<ExportOption["value"]>("markdown");

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
          <FaFileExport className="x-size-4" />
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
          title: t(
            "plugin-export-thread:exportButton.errors.downloadFailed.title",
          ),
          description:
            error instanceof Error
              ? error.message
              : t(
                  "plugin-export-thread:exportButton.errors.downloadFailed.unknownError",
                ),
        });
      }
    },
    [getContent],
  );

  return (
    <Popover
      open={open}
      positioning={{ placement: isMobile ? "bottom" : "bottom-end" }}
      onOpenChange={({ open }) => setOpen(open)}
    >
      <PopoverTrigger asChild>
        <Button
          variant={isMobile ? "default" : "primary"}
          size="sm"
          className="x-box-content x-h-8 x-px-2"
        >
          {isFetching ? defaultIdleText : (copyConfirmText ?? defaultIdleText)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="x-flex x-flex-col x-gap-4">
        <ExportFormatSelect onValueChange={setFormat} />

        <Checkbox
          label={t("plugin-export-thread:exportButton.includeCitations")}
          defaultChecked={includeCitations}
          onCheckedChange={({ checked }) => {
            setIncludeCitations(checked as boolean);
          }}
        />

        <ExportActions
          onDownload={() => {
            setOpen(false);
            handleDownload(includeCitations);
          }}
          onCopy={() => {
            setOpen(false);
            copyThread({
              withCitations: includeCitations,
              onComplete: () => {
                setCopyConfirmText(
                  <div className="x-flex x-items-center x-gap-2">
                    <LuCheck className="x-size-4" />
                    {!isMobile && (
                      <span>
                        {t("plugin-export-thread:exportButton.copied")}
                      </span>
                    )}
                  </div>,
                );
              },
            });
          }}
        />
      </PopoverContent>
    </Popover>
  );
});

export default ExportButton;
