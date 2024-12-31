import MermaidDownloadSvg from "@/features/plugins/thread/canvas/components/action-buttons/Mermaid/DownloadSvg";
import MermaidOpenInPlayground from "@/features/plugins/thread/canvas/components/action-buttons/Mermaid/OpenInPlayground";

export default function MermaidCanvasActionButtonsWrapper() {
  return (
    <div className="tw-flex tw-items-center tw-gap-1">
      <MermaidDownloadSvg />
      <MermaidOpenInPlayground />
    </div>
  );
}
