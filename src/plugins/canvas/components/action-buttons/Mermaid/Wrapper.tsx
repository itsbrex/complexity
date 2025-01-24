import MermaidDownloadSvg from "@/plugins/canvas/components/action-buttons/Mermaid/DownloadSvg";
import MermaidOpenInPlayground from "@/plugins/canvas/components/action-buttons/Mermaid/OpenInPlayground";

export default function MermaidCanvasActionButtonsWrapper() {
  return (
    <div className="tw-flex tw-items-center tw-gap-1">
      <MermaidDownloadSvg />
      <MermaidOpenInPlayground />
    </div>
  );
}
