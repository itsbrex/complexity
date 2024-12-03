import { LuCode, LuEye } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { useMirroredCodeBlockContext } from "@/features/plugins/thread/better-code-blocks/MirroredCodeBlockContext";

export default function MermaidPreviewButton() {
  const { content, setContent } = useMirroredCodeBlockContext()((state) => ({
    content: state.content,
    setContent: state.setContent,
  }));

  return (
    <Tooltip
      content={
        content === "mermaid"
          ? t("plugin-better-code-blocks:headerButtons.mermaid.code")
          : t("plugin-better-code-blocks:headerButtons.mermaid.preview")
      }
    >
      <div
        className="tw-cursor-pointer tw-text-muted-foreground tw-transition-colors hover:tw-text-foreground"
        onClick={() => {
          setContent(content === "mermaid" ? "code" : "mermaid");
        }}
      >
        {content === "mermaid" ? (
          <LuCode className="tw-size-4" />
        ) : (
          <LuEye className="tw-size-4" />
        )}
      </div>
    </Tooltip>
  );
}
