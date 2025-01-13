import DownloadAsInteractiveHtml from "@/features/plugins/thread/canvas/components/action-buttons/Markmap/DownloadAsInteractiveHtml";
import OpenAsInteractiveHtml from "@/features/plugins/thread/canvas/components/action-buttons/Markmap/OpenAsInteractiveHtml";

export default function MarkmapCanvasActionButtonsWrapper() {
  return (
    <div className="tw-flex tw-items-center tw-gap-1">
      <DownloadAsInteractiveHtml />
      <OpenAsInteractiveHtml />
    </div>
  );
}
