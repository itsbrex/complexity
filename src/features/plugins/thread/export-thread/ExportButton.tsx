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
import useToggleButtonText from "@/hooks/useToggleButtonText";

const ExportButton = memo(function ExportButton() {
  const { copyThread, isFetching } = useCopyMessage();

  const defaultIdleText = useMemo(
    () =>
      isFetching ? (
        <>
          <LuLoader2 className="tw-mr-2 tw-size-4 tw-animate-spin" />
          <span>Export</span>
        </>
      ) : (
        <>
          <LuDownload className="tw-mr-2 tw-size-4" />
          <span>Export</span>
        </>
      ),
    [isFetching],
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
              <>
                <LuCheck className="tw-mr-2 tw-size-4" />
                <span>Copied</span>
              </>,
            ),
        });
      }}
    >
      <DropdownMenuTrigger asChild disabled={isFetching}>
        <Button variant="outline" size="sm" className="tw-h-8 tw-px-2">
          {isFetching ? defaultIdleText : (copyConfirmText ?? defaultIdleText)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem value="default">
          <BiLogoMarkdown className="tw-mr-2 tw-size-4" />
          <span>Default</span>
        </DropdownMenuItem>
        <DropdownMenuItem value="without-citations">
          <LuLink2Off className="tw-mr-2 tw-size-4" />
          <span>Without citations</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export default ExportButton;
