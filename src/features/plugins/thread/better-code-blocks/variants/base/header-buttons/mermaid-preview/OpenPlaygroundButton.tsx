import { LuPencilLine } from "react-icons/lu";
import { sendMessage } from "webext-bridge/content-script";

import Tooltip from "@/components/Tooltip";
import { toast } from "@/components/ui/use-toast";
import { useMirroredCodeBlockContext } from "@/features/plugins/thread/better-code-blocks/MirroredCodeBlockContext";

export default function OpenPlaygroundButton() {
  const codeString = useMirroredCodeBlockContext()((state) => state.codeString);

  return (
    <Tooltip
      content={t("plugin-better-code-blocks:headerButtons.mermaid.openEditor")}
    >
      <div
        className="tw-cursor-pointer tw-text-muted-foreground tw-transition-colors hover:tw-text-foreground"
        onClick={async () => {
          const url = await sendMessage(
            "mermaidRenderer:getPlaygroundUrl",
            {
              code: codeString,
            },
            "window",
          );

          if (!url) {
            return toast({
              title: "Failed to generate preview URL",
            });
          }

          window.open(url, "_blank");
        }}
      >
        <LuPencilLine className="tw-size-4" />
      </div>
    </Tooltip>
  );
}
