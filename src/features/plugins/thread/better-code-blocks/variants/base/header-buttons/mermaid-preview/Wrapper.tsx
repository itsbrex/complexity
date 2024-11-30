import { useMirroredCodeBlockContext } from "@/features/plugins/thread/better-code-blocks/MirroredCodeBlockContext";
import DownloadButton from "@/features/plugins/thread/better-code-blocks/variants/base/header-buttons/mermaid-preview/DownloadButton";
import OpenPlaygroundButton from "@/features/plugins/thread/better-code-blocks/variants/base/header-buttons/mermaid-preview/OpenPlaygroundButton";
import MermaidPreviewButton from "@/features/plugins/thread/better-code-blocks/variants/base/header-buttons/mermaid-preview/PreviewButton";

export default function MermaidPreviewButtonsWrapper() {
  const content = useMirroredCodeBlockContext()((state) => state.content);

  return (
    <div className="tw-flex tw-items-center tw-gap-4">
      <OpenPlaygroundButton />
      {content === "mermaid" && <DownloadButton />}
      <MermaidPreviewButton />
    </div>
  );
}
