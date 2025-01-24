import { useMutation } from "@tanstack/react-query";
import { LuCodesandbox, LuLoaderCircle } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { canvasStore } from "@/plugins/canvas/store";
import { createSandbox } from "@/utils/sandpack";

export default function SandpackCanvasActionButtonsWrapper() {
  const { mutate: createCodeSandbox, isPending } = useMutation({
    mutationKey: ["create-code-sandbox"],
    mutationFn: async () => {
      const files = canvasStore.getState().sandpackPreviewRef?.getClient()
        ?.sandboxSetup.files;

      if (!files) return;

      const url = await createSandbox(files);

      window.open(url, "_blank");
    },
  });

  return (
    <div className="tw-flex tw-items-center tw-gap-1">
      <Tooltip content={t("plugin-canvas:canvas.tooltip.openInCodeSandbox")}>
        <Button
          variant="ghost"
          size="iconSm"
          disabled={isPending}
          onClick={() => {
            createCodeSandbox();
          }}
        >
          {isPending ? (
            <LuLoaderCircle className="tw-size-4 tw-animate-spin" />
          ) : (
            <LuCodesandbox className="tw-size-4" />
          )}
        </Button>
      </Tooltip>
    </div>
  );
}
